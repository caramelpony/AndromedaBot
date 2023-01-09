For the bot to be able to send messages from the discord relay, it must be wearing a prim with this script attatched.

```
string originalObjectName;
integer listenHandle;

default
{
    state_entry()
    {
        originalObjectName = llGetObjectName();
        listenHandle = llListen(10834, "", llGetOwner(), "");
    }

    listen(integer channel, string name, key id, string message)
    {
        if (channel == 10834 && id == llGetOwner()) {
           list msgList = llParseString2List(message, [":"], [""]); // Using a colon as a separator as this character cannot exist in a discord username.

            // Return early if the length is less than two. This will indicate that there's a missing message or username.
            if (llGetListLength(msgList) < 2) {
                return;
            }

            string username = (string)llList2List(msgList, 0, 0);
            llSetObjectName(username + " (Discord Relay)");

            integer unameLength = llStringLength(username);
            string trimmedMessage = llGetSubString(message, unameLength + 2, -1);
            trimmedMessage = llStringTrim(trimmedMessage, STRING_TRIM);

            //llSay(0, "<" + llDumpList2String(parsedMessage,"><") + ">");
            llSay(0, trimmedMessage);

            llSetObjectName(originalObjectName); // Reset name to original object name.
        }
    }
}

```
