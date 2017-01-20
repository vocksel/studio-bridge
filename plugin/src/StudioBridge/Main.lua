local PLUGIN_NAME = "Studio Bridge"

-- Suppresses the "unknown global" warnings.
local plugin = plugin
local toolbar = plugin:CreateToolbar(PLUGIN_NAME)

local function createSyncButton()
  local tooltip = "Establishes a connection to the server and starts syncing "..
    "changes made on the filesystem."
  local icon = "rbxassetid://619356746"

  return toolbar:CreateButton("Sync", tooltip, icon)
end

local function createOptionsButton()
  local tooltip = ("Configure options for %s."):format(PLUGIN_NAME)
  local icon = "rbxassetid://619383224"

  return toolbar:CreateButton("Settings", tooltip, icon)
end

createSyncButton()
createOptionsButton()
