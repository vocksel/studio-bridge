# Studio Bridge Plugin

Handles syncing files served up by the server to Roblox Studio.

## Install

[Download from the Roblox website](https://www.roblox.com/library/626028645/Studio-Bridge).

## Compiling

You need Python 3+ and [Elixir](https://github.com/vocksel/elixir) installed. From there you can run the following commands to compile the plugin:

```shell
$ cd plugin/
$ python build.py
```

Note that the build script is setup to compile the plugin directly to Roblox's `Plugins` folder on **Windows**. You'll have to modify the paths if you're on OS X.
