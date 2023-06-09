import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { PecBearerGeneratorT } from "src/types/token";
import { IPecServerClient, pecServerClient } from "../clients/pecserver";
import {
  PecServersConfig,
  PecServerConfig,
  getHttpsApiFetchWithBearer
} from "../config";
import { IPecServerClientFactoryInterface } from "./IPecServerClientFactory";

const findById = (sources: PecServersConfig, serviceId: NonEmptyString) =>
  O.fromNullable(
    Object.values(sources)
      .filter(PecServerConfig.is)
      .find(c => c.serviceId === serviceId)
  );

export default class PecServerClientFactory
  implements IPecServerClientFactoryInterface {
  private readonly DEFAULT_PEC_CONFIG = this.pecConfigs.poste;

  constructor(private readonly pecConfigs: PecServersConfig) {}

  /**
   * This method returns a specific pec server client based on
   * provider serviceId
   * {@inheritDoc}
   */
  public getClient(
    bearerGenerator: PecBearerGeneratorT,
    maybeServiceId?: NonEmptyString
  ): TE.TaskEither<Error, ReturnType<IPecServerClient>> {
    const pecServerConfig = O.fromNullable(maybeServiceId)
      .chain(serviceId => findById(this.pecConfigs, serviceId))
      .getOrElse(this.DEFAULT_PEC_CONFIG);

    return bearerGenerator(pecServerConfig).map(token =>
      pecServerClient(
        pecServerConfig.url,
        pecServerConfig.basePath,
        getHttpsApiFetchWithBearer(token)
      )
    );
  }
}
