# The source code is compiled into a Roblox Model right into the plugins folder.
#
# Simply run `python build.py` and everything will be taken care of. You can
# then load up any game and test out the plugin.

import os
import os.path

from elixir.compilers import ModelCompiler

local_app_data = os.environ["LocalAppData"]
plugins_folder = os.path.join(local_app_data, "Roblox/Plugins")
plugin = os.path.join(plugins_folder, "StudioBridge.rbxmx")

ModelCompiler("src/", plugin).compile()
