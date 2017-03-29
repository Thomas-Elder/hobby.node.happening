/**
 * Management module
 * @module mgmt
 */


var includes = require('thombsaway-includes').includes;

/**
 * A class for handling the storage of User and Room objects.
 * @constructor
 */
var Manager = function(){
  this.rooms = [];
  this.users = [];
};

/**
 * Returns an array of Room objects.
 * 
 * @return {array} rooms - an array of Room objects
 */
Manager.prototype.Rooms = function(){
  return this.rooms;
};

/**
 * Returns an array of User objects
 * @return {array} users - an array of User objects
 */
Manager.prototype.Users = function(){
  return this.users;
};

/**
 * Adds a Room object to the list of rooms currently in the system.
 * 
 * The list of Rooms is sorted by id.
 * 
 * @param {Room} room - the Room to be added
 */
Manager.prototype.AddRoom = function(room){
  this.rooms.push(room);
  this.rooms.sort(function(a, b){
    return a.id > b.id;
  });
};

/**
 * Adds a User object to the list of users currently online.
 * 
 * The list of Users is sorted by id.
 * 
 * @param {User} user - the User to be added
 */
Manager.prototype.AddUser = function(user){
  this.users.push(user);
  this.users.sort(function(a, b){
    return a.id > b.id;
  });
};

/**
 * Adds a user to the specified room.
 * 
 * @param {Room} room - 
 * @param {User} user - 
 * 
 * @return {string} - returns the room id which the user is either already in, or now in.
 */
Manager.prototype.AddUserToRoom = function(room, user){

  if (user.roomId === null){
    user.roomId = room.id;
    room.Add(user);
    return user.roomId;
  } else {
    return user.roomId;
  }
};

/**
 * Represents a user
 * @constructor
 * 
 * @param {string} id - a unique identifier for the User
 * @param {string=} name - optionally a name for the User
 * 
 * @prop {string} id - a unique identifier for the User
 * @prop {string} name - a name for the User
 */
var User = function(id, name){
  this.id = id;
  this.roomId = null;

  name ? this.name = name : this.name = "None";
};

/**
 * Optionally takes a string to change the user's name. 
 * Returns the user's name. 
 * 
 * @param {string=} name - the new name for the user.
 * 
 * @return {string} the current name of the User (after change).
 */
User.prototype.Name = function(name){
  
  this.name = name;   
  return this.name;
};

/**
 * Represents a room
 * @constructor
 * 
 * @param {string} id - a string representing the id of the room
 * @param {User} creator - a User object representing the user who opened the room
 * 
 * @prop {string} id - a string representing the id of the room
 * @prop {User} creator - a User object representing the user who opened the room
 * @prop {array} users - an array of User objects, the users currently in the room
 * @prop {boolean} empty - a boolean whether the room's empty or not
 */
var Room = function(id, creator){
  this.id = id;
  this.creator = creator;

  this.users = [creator];
  
  this.empty = false;

  creator.roomId = this.id;
};

/**
 * Add the specified user to the room
 * 
 * @param {User} user
 */
Room.prototype.Add = function(user){

  this.users.push(user);
};

/**
 * Remove the specified user from the room
 * 
 * @param {string} user
 */
Room.prototype.Rm = function(user){ 

  var index = this.users.findIndex(function(u){
    return u.id === user.id;
  });

  this.users.splice(index, 1);
};

module.exports = {
  Manager,
  User,
  Room
};