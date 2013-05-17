DocCenter
=========


DocCenter is a small but very useful documentation center that allows you to pull in multiple documentation websites into a single interface.

It shows an unobstrusive sidebar on left which allows you to switch documentation sites. The documentation is then loaded as an iframe in the mainarea.

It also allows you to configure multiple channels for every documentation resource.
The user can then switch between the channels and DocCenter remembers which channel was used on which resource and will use that channel on reload.
Channels could be anything like the version of the framework that you are using, or even a Local channel that loads the documentation generated
from your source repository so that you can always load the bleeding edge if desired.
The name of the current chanel is shown above the resource icon, so that you always know which channel is loaded.
To change the channel simply right-click on the resource and select the channel from the context-menu.

To reload a documentation resource you can just click on the resource icon again when it is already loaded.



Howto setup
-------------

 1. Simply clone/download the repository
 2. Copy `config.json.example` to `config.json` and make the necessary changes.
 3. (Optional) Add custom css to change look and feel.
 4. Load the directory and enjoy

config.json
-----------
Here is a small explanation on what

Howto contribute
----------------
Contributions welcome! Just fork the repository, make your modifications and create a pull-request!