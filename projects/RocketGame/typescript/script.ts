//basic types
let num:number;
let str:string;
let bol:boolean;
let sth:any;

//array types
let numArr:number[];
let strArr:string[];
let bolArr:boolean[];
let sthArr:any[];

//tuple type
let strnumTuple:[string,number];
strnumTuple = ["key",1];

//enumerate type
enum color {"red","green","blue"};
let c:color = color.green;

//class type
class Person{
  private name:string;
  private age:number;
  private height:number;
  private isAlive:boolean;

  constructor(name:string,age:number,height:number,isAlive:boolean){
    this.name=name;
    this.age=age;
    this.height=height;
    this.isAlive=isAlive;
  }

  getName():string{
    return this.name;
  }

  getAge():number{
    return this.age;
  }

  getHeight():number{
    return this.height;
  }

  getIsAlive():boolean{
    return this.isAlive;
  }

}

//array of objects
let people:Person[]=[];

let luka = new Person("luka",23,188,true);
let ante = new Person("ante",21,180,true);
let manuela = new Person("manuela",23,160,true);

people.push(luka);
people.push(manuela);
people.push(ante);

//sort by age:number
people.sort(function(a:Person,b:Person){
  return a.getAge() - b.getAge();
});

//sort by name:string
people.sort(function(a:Person,b:Person){
  let x = a.getName().toLowerCase();
  let y = b.getName().toLowerCase();
  if (x < y) {return -1;}
  if (x > y) {return 1;}
  return 0;
});

for (let entry of people){
  console.log("I am "+entry.getName().toUpperCase()+" and I am "+entry.getAge()+". I am "+entry.getHeight()+" tall and I am "+entry.getIsAlive()+".");
}
