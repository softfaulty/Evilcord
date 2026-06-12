/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2026 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Settings } from "@api/Settings";
import { Logger } from "@utils/Logger";

import { REMOTE_PLUGIN_REGISTRY_URL } from "./constants";
import type { InstalledRemotePlugin, RemotePluginManifest, RemotePluginRegistry } from "./types";

const logger = new Logger("RemotePluginManager", "#babbf1");

const requiredManifestFields = [
    "id",
    "name",
    "description",
    "author",
    "version",
    "downloadUrl",
    "hash"
] as const;

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function assertRegistryShape(value: unknown): asserts value is RemotePluginRegistry {
    if (!isObject(value) || !Array.isArray(value.plugins))
        throw new Error("Invalid remote plugin registry: plugins must be an array");

    value.plugins.forEach((plugin, index) => {
        if (!isObject(plugin))
            throw new Error(`Invalid remote plugin registry: plugin ${index} must be an object`);

        for (const field of requiredManifestFields) {
            if (typeof plugin[field] !== "string" || plugin[field] === "")
                throw new Error(`Invalid remote plugin registry: plugin ${index} is missing ${field}`);
        }

        if (!Array.isArray(plugin.tags) || plugin.tags.some(tag => typeof tag !== "string"))
            throw new Error(`Invalid remote plugin registry: plugin ${index} has invalid tags`);

        if (typeof plugin.pluginApiVersion !== "string" || plugin.pluginApiVersion === "")
            throw new Error(`Invalid remote plugin registry: plugin ${index} is missing pluginApiVersion`);

        if (plugin.loadType !== "lazy" && plugin.loadType !== "boot")
            throw new Error(`Invalid remote plugin registry: plugin ${index} has invalid loadType`);
    });
}

export const RemotePluginManager = {
    async fetchRegistry(): Promise<RemotePluginRegistry> {
        const response = await fetch(REMOTE_PLUGIN_REGISTRY_URL);

        if (!response.ok)
            throw new Error(`Failed to fetch remote plugin registry: ${response.status} ${response.statusText}`);

        const registry = await response.json() as unknown;
        assertRegistryShape(registry);

        if (IS_DEV)
            logger.info(
                "Fetched remote plugins:",
                registry.plugins.map(plugin => plugin.name).join(", ") || "none"
            );

        return registry;
    },

    async getRemotePlugins(): Promise<RemotePluginManifest[]> {
        const registry = await this.fetchRegistry();

        return registry.plugins;
    },

    getInstalledPlugins(): Record<string, InstalledRemotePlugin> {
        return Settings.remotePlugins.installed;
    },

    async installPlugin(_manifest: RemotePluginManifest): Promise<void> {
        return;
    },

    async removePlugin(_pluginId: string): Promise<void> {
        return;
    },

    async enablePlugin(_pluginId: string): Promise<void> {
        return;
    },

    async disablePlugin(_pluginId: string): Promise<void> {
        return;
    }
};
