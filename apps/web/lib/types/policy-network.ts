import { z } from "zod";
import {
  NetworkConfigurationSchema,
  WiFiConfigSchema,
} from "../schemas/policy-network";

export type WiFiConfig = z.infer<typeof WiFiConfigSchema>;
export type NetworkConfiguration = z.infer<typeof NetworkConfigurationSchema>;

export type NetworkConfigurations = NetworkConfiguration[];
