#todo
##User and Room management
I need to create a module for handling the tracking of rooms and users. Shit is getting clumsy in the event module.

I might need to figure out a way of creating room ids independently of the socket.id as this makes it impossible to open two rooms in a session. 

So let's figure out an interface for this module then write some tests for it, then write it.

git branch mgmt

mgmt

rooms()
users()

user:
  create()
  delete()

  isInRoom()

room:
  create()
  add()
  rm()
  delete()

  users()
  isEmpty()
