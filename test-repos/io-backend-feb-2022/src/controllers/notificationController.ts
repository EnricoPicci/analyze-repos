/**
 * This controller handles webhook requests from the API backend.
 */

import * as express from "express";
import {
  IResponseErrorInternal,
  IResponseErrorValidation,
  IResponseSuccessJson,
  ResponseSuccessJson
} from "italia-ts-commons/lib/responses";

import { toError } from "fp-ts/lib/Either";
import { fromEither, tryCatch } from "fp-ts/lib/TaskEither";
import { Millisecond } from "italia-ts-commons/lib/units";
import { Installation } from "../../generated/backend/Installation";
import { InstallationID } from "../../generated/backend/InstallationID";

import { Notification } from "../../generated/notifications/Notification";
import { SuccessResponse } from "../../generated/notifications/SuccessResponse";

import NotificationService from "../services/notificationService";
import RedisSessionStorage from "../services/redisSessionStorage";
import { withUserFromRequest } from "../types/user";
import { log } from "../utils/logger";
import {
  withCatchAsInternalError,
  withValidatedOrValidationError
} from "../utils/responses";

const delay = (ms: Millisecond) => new Promise(ok => setTimeout(ok, ms));

export interface INotificationControllerOptions {
  readonly notificationDefaultSubject: string;
  readonly notificationDefaultTitle: string;
}

export default class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly sessionStorage: RedisSessionStorage,
    private readonly opts: INotificationControllerOptions
  ) {}

  public readonly notify = async (
    req: express.Request
  ): Promise<
    | IResponseErrorInternal
    | IResponseErrorValidation
    | IResponseSuccessJson<SuccessResponse>
  > =>
    withCatchAsInternalError(async () =>
      withValidatedOrValidationError(
        Notification.decode(req.body),
        (data: Notification) =>
          tryCatch(
            async () =>
              await this.sessionStorage.userHasActiveSessions(
                data.message.fiscal_code
              ),
            toError
          )
            .chain(fromEither)
            .map(async userHasActiveSessions =>
              userHasActiveSessions && "content" in data.message
                ? // send the full message only if the user has an
                  // active session and the message content is defined
                  await this.notificationService.notify(
                    data,
                    data.message.content.subject
                  )
                : // send a generic message
                  // if the user does not have an active session
                  // or the message content is not defined
                  await this.notificationService.notify(
                    data,
                    this.opts.notificationDefaultSubject,
                    this.opts.notificationDefaultTitle
                  )
            )
            .getOrElseL(async error => {
              throw error;
            })
            .run()
      )
    );

  public async createOrUpdateInstallation(
    req: express.Request
  ): Promise<IResponseErrorValidation | IResponseSuccessJson<SuccessResponse>> {
    return withUserFromRequest(req, async user =>
      withValidatedOrValidationError(InstallationID.decode(req.params.id), _ =>
        withValidatedOrValidationError(
          Installation.decode(req.body),
          installation => {
            // async fire & forget
            // On login, we do a deleteInstallation to prevent a device to be associated with a previous user, which might be a different one
            // We have empirical evidence that such deleteInstallation is processed after the createOrUpdateInstallation,
            //  so that the installation we are recording after login is lost
            // The correct order of execution must be enforced by the processing notifications service.
            // Anyway, to quickly mitigate the disservice to our users, we apply this temporary workaround
            delay(10000 as Millisecond)
              .then(() =>
                this.notificationService.createOrUpdateInstallation(
                  user.fiscal_code,
                  installation
                )
              )
              .catch(err => {
                log.error(
                  "Cannot create installation: %s",
                  JSON.stringify(err)
                );
              });
            return ResponseSuccessJson({ message: "ok" });
          }
        )
      )
    );
  }
}
