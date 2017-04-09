//basic types
var num;
var str;
var bol;
var sth;
//array types
var numArr;
var strArr;
var bolArr;
var sthArr;
//tuple type
var strnumTuple;
strnumTuple = ["key", 1];
//enumerate type
var color;
(function (color) {
    color[color["red"] = 0] = "red";
    color[color["green"] = 1] = "green";
    color[color["blue"] = 2] = "blue";
})(color || (color = {}));
;
var c = color.green;
//class type
var Person = (function () {
    function Person(name, age, height, isAlive) {
        this.name = name;
        this.age = age;
        this.height = height;
        this.isAlive = isAlive;
    }
    Person.prototype.getName = function () {
        return this.name;
    };
    Person.prototype.getAge = function () {
        return this.age;
    };
    Person.prototype.getHeight = function () {
        return this.height;
    };
    Person.prototype.getIsAlive = function () {
        return this.isAlive;
    };
    return Person;
}());
//array of objects
var people = [];
var luka = new Person("luka", 23, 188, true);
var ante = new Person("ante", 21, 180, true);
var manuela = new Person("manuela", 23, 160, true);
people.push(luka);
people.push(manuela);
people.push(ante);
//sort by age:number
people.sort(function (a, b) {
    return a.getAge() - b.getAge();
});
//sort by name:string
people.sort(function (a, b) {
    var x = a.getName().toLowerCase();
    var y = b.getName().toLowerCase();
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
});
for (var _i = 0, people_1 = people; _i < people_1.length; _i++) {
    var entry = people_1[_i];
    console.log("I am " + entry.getName().toUpperCase() + " and I am " + entry.getAge() + ". I am " + entry.getHeight() + " tall and I am " + entry.getIsAlive() + ".");
}
