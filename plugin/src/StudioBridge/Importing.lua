--[[
  Imports the file structure exported by our server.
--]]

local http = game:GetService("HttpService")

local URL = "localhost"
local PORT = 8080

local function newScript(name, className, source, parent)
  local src = Instance.new(className or "Script")
  src.Name = name
  src.Source = source
  src.Parent = parent

  return src
end

local function newFolder(name, parent)
  local folder = Instance.new("Folder")
  folder.Name = name
  folder.Parent = parent

  return folder
end

local function handleExistingScript(instance, fileObject)
  if instance.ClassName == fileObject.className then
    instance.Source = fileObject.source
  else
    local replacement = newScript(fileObject.name, fileObject.className,
      fileObject.source, instance.Parent)

    instance:Destroy()

    return replacement
  end
end

local function handleExistingInstance(instance, fileObject)
  if instance:IsA("LuaSourceContainer") and fileObject.source then
    return handleExistingScript(instance, fileObject)
  end

  return instance
end

local function getInstanceFromFileObject(fileObject, parent)
  local name = fileObject.name
  local existingInstance = parent:FindFirstChild(name)

  if existingInstance then
    return handleExistingInstance(existingInstance, fileObject)
  else
    if fileObject.source then
      return newScript(fileObject.name, fileObject.className, fileObject.source,
        parent)
    else
      return newFolder(fileObject.name, parent)
    end
  end
end

local function importHierarchy(hierarchy, parent)
  local parent = parent or game

  for _, fileObject in ipairs(hierarchy) do
    local instance = getInstanceFromFileObject(fileObject, parent)

    if fileObject.children then
      importHierarchy(fileObject.children, instance)
    end
  end
end

--------------------------------------------------------------------------------

local importing = {}

function importing.importFromServer()
  local server = "http://" .. URL .. ":" .. PORT
  local hierarchy = http:JSONDecode(http:GetAsync(server))
  importHierarchy(hierarchy)
end

function importing.protectedImport()
  local success, message = pcall(importing.importFromServer)

  if not success then
    warn(message)
  end

  return success
end

return importing
