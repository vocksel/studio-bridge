local PLUGIN_NAME = "Studio Bridge"

--------------------------------------------------------------------------------
-- Plugin Setup
--------------------------------------------------------------------------------

-- Suppresses the "unknown global" warnings.
local plugin = plugin
local toolbar = plugin:CreateToolbar(PLUGIN_NAME)

--------------------------------------------------------------------------------
-- Settings
--------------------------------------------------------------------------------

local function initializeSettings()
  local runBefore = plugin:GetSetting("RunBefore") or false

  if not runBefore then
    plugin:SetSettings("RunBefore", true)

    plugin:SetSettings("AutoSync", false)
    plugin:SetSettings("RefreshRate", .25)
  end
end

initializeSettings()

--------------------------------------------------------------------------------
-- Button Setup
--------------------------------------------------------------------------------

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
