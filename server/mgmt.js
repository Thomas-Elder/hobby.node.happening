
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
Mgmt.prototype.rooms = function(){
  return rooms;
};

/**
 * Returns an array of User objects
 * @return {array} users
 */
Mgmt.prototype.users = function(){
  return users;
};

/**
 * Represents a user
 * @constructor
 * 
 * @param {string} id 
 */
var User = function(id){
  this.id = id;
};

/**
 * Takes a string to change the user's name. 
 * Returns the user's name. 
 * 
 * @param {string} name
 * @return {string} name
 */
User.prototype.name = function(name){

  if(name === undefined)
    this.name = name; 
  
  return this.name;
};

/**
 * Represents a room
 * @constructor
 * @param {string} id 
 * @param {User} creator 
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
Room.prototype.add = function(user){
  this.users.add(user);

  var min = this.users.reduce(function(prev, curr){
    return prev.id < curr.id ? prev.id : curr.id;
  });

  console.log('min == ', min);

  var min = entries.reduce(function(prev, curr){
    return prev.quantity < curr.quantity ? prev.quantity : curr.quantity;
  });

  var max = entries.reduce(function(prev, curr){
    return prev.quantity > curr.quantity ? prev.quantity : curr.quantity;
  });


};

/**
 * Remove the specified user from the room
 * @param {string} user
 */
Room.prototype.rm = function(user){ 
  var index = this.users.findIndex(user);
  this.users.splice(index, 1);
};

module.exports = {
  Mgmt,
  User,
  Room
};