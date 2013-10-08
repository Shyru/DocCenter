/**
 * Copyright (C) 2013  Daniel Haas <shyru@web.de>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

$(document).ready(function(){

    function addResource(_resource)
    {
        if (!_resource.id) _resource.id=_resource.name.replace(/\s/,'_').toLowerCase();

        var channelStorageKey="DocCenter_currentchannel_"+_resource.id;

        var activeChannelName=localStorage.getItem(channelStorageKey);
        var displayChannel="none";
        var channelClass="";
        var currentUrl=_resource.url;
        if (activeChannelName) displayChannel="block";



        if (_resource.channels)
        { //we have channels, so create some information about it
            var menuItems={
                channel_default:{
                    name:"Default",
                    icon:activeChannelName ? 'inactive':'active',
                    url:_resource.url
                }
            };
            for (var i=0; i<_resource.channels.length; i++)
            {
                var channel=_resource.channels[i];
                var icon="inactive";
                if (activeChannelName==channel.name) {
                    icon="active";
                    channelClass=channel.cls;
                    currentUrl=channel.url;
                }
                menuItems["channel_"+channel.name]={
                    name:channel.name,
                    icon:icon,
                    url:channel.url,
                    cls:channel.cls
                }
            }
        }


        //create the sidebar entry for the resource
        $('#sidebar').append($('<a class="resource" id="resource_button_'+_resource.id+'" href="#'+_resource.name+'"><span class="'+_resource.iconClass+'" title="'+currentUrl+'">'+_resource.name+'</span><div class="'+channelClass+'" style="display:'+displayChannel+'">'+activeChannelName+'</div></a>')
                    .data("resource",_resource)
                    .data("currentUrl",currentUrl)
                    .click(function(_event){
                        console.log("clicked on "+_resource.name);
                        var resource=$(_event.target.parentNode).data("resource");

                        if ($(_event.target.parentNode).hasClass("active"))
                        { //we are already active, lets reload the iframe
                            var currentUrl=$(_event.target.parentNode).data("currentUrl");
                            var now=new Date();
                            $('#resource_'+resource.id+" iframe").attr("src",currentUrl+"?cb="+now.getTime());
                        }
                        $('#sidebar a').removeClass("active");
                        $(_event.target.parentNode).addClass("active");



                        //now show the right iframe
                        $('.resource-container').hide();
                        $('#resource_'+resource.id).show();
                    }
        ));

        //attach the context menu if necessary
        if (_resource.channels)
        { //we have channels, so attach a context menu to switch channels

            $.contextMenu({
                selector:'#resource_button_'+_resource.id+'',
                className: 'css-title',
                build:function(){
                    return {
                        callback:function(_key,_options)
                        {
                            console.log("callback",arguments);
                            //update enabled/disabled state of menu items
                            for (var menuItemName in menuItems)
                            {
                                if (menuItems.hasOwnProperty(menuItemName)) menuItems[menuItemName].icon="inactive";
                            }
                            menuItems[_key].icon="active";
                            var buttonElement=$('#resource_button_'+_resource.id);
                            var channelElement=$('#resource_button_'+_resource.id+' div');


                            //update src of iframe to the new url of the channel
                            $('#resource_'+_resource.id+" iframe").attr("src",menuItems[_key].url);
                            //also update the title with the new url
                            $('#resource_button_'+_resource.id+' span').attr("title",menuItems[_key].url);
                            //also update the currentUrl data so that we can reload the correct url on re-click
                            buttonElement.data("currentUrl",menuItems[_key].url);


                            if (menuItems[_key].cls)
                            { //channel has cls, apply it to the channel
                                channelElement.attr("class",menuItems[_key].cls);
                            }
                            else channelElement.attr("class","");


                            if (_key=="channel_default")
                            { //the default channel was selected, hide the channel overlay
                                channelElement.hide();
                                localStorage.removeItem(channelStorageKey);
                            }
                            else
                            { //update and show channel overlay
                                channelElement.html(menuItems[_key].name);
                                channelElement.show();
                                localStorage.setItem(channelStorageKey,menuItems[_key].name);
                            }
                        },
                        items:menuItems
                    }
                }
            });
        }
        else
        {
            $.contextMenu({
                selector:'#resource_button_'+_resource.id+'',
                autoHide:true,
                delay:500,
                items:{
                    no:{
                        html:"<span>No channels available<br/>for this resource!</span>",
                        type:'html'
                    }
                }
            });
        }

        //create the main entry for the resource
        $('#main').append($('<div class="resource-container" style="display:none" id="resource_'+_resource.id+'"><iframe src="'+currentUrl+'"></iframe></div>'));
    }

    $.getJSON("config.json",function(_config) {
        console.log("Config loaded:",_config);

        //update document title from config:
        document.title=_config.title;

        if (_config.css)
        { //load additional css
            $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', _config.css) );

        }

        for (var i=0; i<_config.resources.length; i++)
        {
            var resource=_config.resources[i];
            console.log("Adding resource:",resource);
            addResource(resource);
        }


        $("#sidebar a[href='" + location.hash + "'] span").click();


    })
});