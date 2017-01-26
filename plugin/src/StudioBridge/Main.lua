local coreGui = game:GetService("CoreGui")

local PLUGIN_NAME = "Studio Bridge"

-- When using Auto Sync, this determines how often (in seconds) we sync with the
-- server.
--
-- All plugins share a limit of 500 HTTP requests per minute, so we need to set
-- this fairly conservatively. We don't want to perform too many requests and
-- stall out other plugins.
local REFRESH_RATE = 60/40 -- 40 requests per minute. 1.5 requests a second.

local importing = require(script.Parent.Importing)
local protectedImport = importing.protectedImport

--------------------------------------------------------------------------------
-- Plugin Setup
--------------------------------------------------------------------------------

-- Suppresses the "unknown global" warnings.
local plugin = plugin
local toolbar = plugin:CreateToolbar(PLUGIN_NAME)

--[[ Global state for auto syncing.

  If true, the "Sync" button will continuously sync with the server. If false,
  it syncs once. ]]
local isAutoSyncEnabled = false

--------------------------------------------------------------------------------
-- Button Setup
--------------------------------------------------------------------------------

local function createSyncButton()
  local tooltip = "Establishes a connection to the server and starts syncing "..
    "changes made on the filesystem."
  local icon = "rbxassetid://619356746"

  return toolbar:CreateButton("Sync", tooltip, icon)
end

local function setupSyncButton()
  local button = createSyncButton()

  -- We have to keep this outside of the Click event, otherwise we won't be able
  -- to debounce it and the user can run multiple auto sync loops.
  local syncing = false

  local function runImportLoop()
    while syncing do
      local success = protectedImport()

      if not success and syncing then
        syncing = false
        break
      end

      wait(REFRESH_RATE)
    end
  end

  local function autoImport()
    if not syncing then
      syncing = true
      runImportLoop()

      -- This gets run after the above function breaks out of its loop.
      print("[StudioBridge] Auto syncing stopped")
    end

    syncing = false
  end

  button.Click:connect(function()
    if isAutoSyncEnabled then
      print("[StudioBridge] Started auto syncing file changes. Click "..
        "\"Sync\" again to stop")
      autoImport(sycning, plugin)
    else
      print("[StudioBridge] Importing files from the server")
      protectedImport()
    end
  end)
end

local function createAutoSyncToggleButton()
  local tooltip = "Changes the \"Sync\" button to a toggle. When on, file "..
    "changes will be synced automatically."
  local icon = "rbxassetid://619383224"

  return toolbar:CreateButton("Toggle Auto Syncing", tooltip, icon)
end

local function setupAutoSyncToggleButton()
  local button = createAutoSyncToggleButton()

  button.Click:connect(function()
    isAutoSyncEnabled = not isAutoSyncEnabled
    print("[StudioBridge] Auto syncing set to", isAutoSyncEnabled)
  end)
end

setupSyncButton()
setupAutoSyncToggleButton()
