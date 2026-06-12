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

import type { InstalledRemotePlugin, RemotePluginManifest, RemotePluginRegistry } from "./types";

export const RemotePluginManager = {
    async fetchRegistry(): Promise<RemotePluginRegistry> {
        return {
            plugins: []
        };
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
