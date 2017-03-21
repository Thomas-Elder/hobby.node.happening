
/**
 * @constructor
 */
var Mgmt = function(){
  this.rooms = [];
  this.users = [];
};

/**
 * Returns an array of Room objects
 * @return {array} rooms
 */
Mgmt.prototype.Rooms = function(){
  return rooms;
};

/**
 * Returns an array of User objects
 * @return {array} users
 */
Mgmt.prototype.Users = function(){
  return users;
};

/**
 * Represents a user
 * @constructor
 * 
 * @param {string} id
 * @param {string=} name
 * 
 * @prop {string} id
 * @prop {string} name
 */
var User = function(id, name){
  this.id = id;

  name ? this.name = name : this.name = "None";
};

/**
 * Takes a string to change the user's name. 
 * Returns the user's name. 
 * 
 * @param {string} name
 * @return {string} name
 */
User.prototype.Name = function(name){
  
  this.name = name;   
  return this.name;
};

/**
 * Represents a room
 * @constructor
 * @param {string} id 
 * @param {User} creator
 * 
 * @prop {User} creator
 * @prop {string} id
 * @prop {array} users
 * @prop {boolean} empty
 */
var Room = function(id, creator){
  this.id = id;
  this.creator = creator;

  this.users = [creator];
  
  this.empty = false;
};

/**
 * Add the specified user to the room
 * @param {User} user
 */
Room.prototype.Add = function(user){
  this.users.add(user);

};

/**
 * Remove the specified user from the room
 * @param {string} user
 */
Room.prototype.Rm = function(user){ 
  var index = this.users.findIndex(user);
  this.users.splice(index, 1);
};

module.exports = {
  Mgmt,
  User,
  Room
};