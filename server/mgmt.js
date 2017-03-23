/**
 * Management module
 * @module mgmt
 */


var includes = require('thombsaway-includes').includes;

/**
 * A class for handling the storage of User and Room objects.
 * @constructor
 */
var Mgmt = function(){
  this.rooms = [];
  this.users = [];
};

/**
 * Returns an array of Room objects.
 * 
 * @return {array} rooms - an array of Room objects
 */
Mgmt.prototype.Rooms = function(){
  return this.rooms;
};

/**
 * Returns an array of User objects
 * @return {array} users - an array of User objects
 */
Mgmt.prototype.Users = function(){
  return this.users;
};

/**
 * 
 * @param {Room} room - 
 */
Mgmt.prototype.AddRoom = function(room){

};

/**
 * 
 * @param {User} user - 
 */
Mgmt.prototype.AddUser = function(user){
  this.users.push(user);
  this.users.sort(function(a, b){
    return a.id > b.id;
  });
};

/**
 * 
 * @param {Room} room - 
 * @param {User} user - 
 */
Mgmt.prototype.AddUserToRoom = function(room, user){

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

  name ? this.name = name : this.name = "None";
};

/**
 * Takes a string to change the user's name. 
 * Returns the user's name. 
 * 
 * @param {string} name - the new name for the user.
 * 
 * @return {string} the current name of the User (after change).
 */
User.prototype.Name = function(name){
  
  this.name = name;   
  return this.name;
};

/**
 * Optionally takes a room object to assign this user to it. 
 * Returns the room this user is in. Returns null if the user is not in a room.
 * 
 * @param {Room=} room - the room to which the user is being assigned.
 * @return {Room} - the room the user is currently in.
 */
User.prototype.Room = function(room){

  room ? this.room = room : this.room = null;

  return this.room;
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

  creator.Room(this);
};

/**
 * Add the specified user to the room
 * 
 * @param {User} user
 */
Room.prototype.Add = function(user){

  user.Room(this);
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
  Mgmt,
  User,
  Room
};