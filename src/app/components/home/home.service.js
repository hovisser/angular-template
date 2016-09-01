module.exports = function() {
  //create the service
  var service = function(){
      //header messages or get message
      this.getMessage = function(){
        return "Please change the template";
      }

  }

  return (service);
}
