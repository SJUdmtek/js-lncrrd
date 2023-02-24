// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1>`;

class MyMath {
  //static public field
  static PI = Math.PI;

  // static private field
  static #num = 10;

  // static method
  static increment() {
    return ++MyMath.#num;
  }
}

console.log(MyMath.PI);
console.log(MyMath.increment());
console.log(MyMath.increment());

class Animal {
  constructor(age, weight) {
    this.age = age;
    this.weight = weight;
  }

  eat() {
    return 'eat';
  }

  move() {
    return 'move';
  }
}

// 상속을 통해 Animal 클래스를 확장한 Bird 클래스
class Bird extends Animal {
  fly() {
    return 'fly';
  }
}

const bird = new Bird(15, 23);

console.log(bird);
console.log(bird instanceof Bird);
console.log(bird instanceof Animal);
console.log(bird.eat(), bird.fly(), bird.move());

function Base1() {}
class Base2 {}

let condition = true;

class Derived extends (condition ? Base1 : Base2) {}

const derived = new Derived();
console.log(derived instanceof Base1);
console.log(derived instanceof Base2);

class Base {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}
class Child extends Base {
  // 다음과 같이 암묵적으로 constructor가 정의된다.
  // constructor(...args) { super(...args);}
  constructor(a, b, name, ...rest) {
    super(a, b);
    this.c = rest; // Error: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
    this.name = name;
  }
  sayHi() {
    return `Hi! ${this.name}`;
  }
  static sayHello(name) {
    return `뭐 씨 ${name}`; // 뭐 씨 Child
  }
  // constructor 생략하지 않은 경우 super처리 해줘야됨.
}

const child = new Child(1, 2, '?', 4, 100);
console.log(child);

console.log(Child.sayHello('바'));

class GrandChild extends Child {
  sayHi() {
    // __super는 Child.prototype을 가리킨다.
    const __super = Object.getPrototypeOf(GrandChild.prototype);
    console.log(__super); // Base{}
    return `${__super.sayHi.call(this)} how are you doing?`;
  }
}

const grandChild = new GrandChild();
console.log(grandChild.sayHi());

const base = {
  name: 'Lee',
  sayHi() {
    return `Hi! ${this.name}`;
  },
};

console.log(base.sayHi()); // Hi! Lee

const derived2 = {
  __proto__: base,
  // ES6 메서드 축약 표현으로 정의한 메서드는 [[HomeObject]]를 갖는다.
  sayHi() {
    return `${super.sayHi()}. how are you doing?`;
  },
};

console.log(derived2.sayHi());

class Rectangle {
  constructor(width, height) {
    console.log(this); // ColorRectangle {}
    console.log(new.target); // ƒ ColorRectangle()
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }

  toString() {
    return `width = ${this.width}, height = ${this.height}`;
  }
}

// 서브클래스
class ColorRectangle extends Rectangle {
  constructor(width, height, color) {
    super(width, height);
    console.log(`super절 : ${this}`);
    this.color = color;
    console.log(`color포함: ${this}`);
  }

  // 메서드 오버라이딩
  toString() {
    return super.toString() + `, color = ${this.color}`;
  }
}

const colorRectangle = new ColorRectangle(2, 4, 'red');
console.log(colorRectangle);
console.log(colorRectangle.getArea());
console.log(colorRectangle.toString());

class MyArray extends Array {
  // 중복된 배열 요소를 제거하고 반환한다. [1,1,2,3] => [1,2,3]
  uniq() {
    return this.filter((v, i, self) => self.indexOf(v) === i);
  }
  // 모든 배열 요소의 평균을 구한다: [1,2,3] => 2
  average() {
    return this.reduce((pre, cur) => pre + cur, 0) / this.length;
  }
  // 모든 메서드가 Array 타입의 인스턴스를 반환하도록 한다.
  // static get [Symbol.species]() {
  //   return Array;
  // } //Error: myArray.uniq(...).average is not a function
}

const myArray = new MyArray(1, 1, 2, 3);
console.log(myArray);

console.log(myArray.uniq()); // [1,2,3]
console.log(myArray.uniq().average()); //2

console.log(Array.from.prototype); // undefined
console.log(myArray.super);

const create = (id, content) => ({ id, content });
console.log(create(10, 'java')); // {id: 10, content: "java"}

// 즉시 실행 함수로 쓰는 경우
const person = ((name) => ({
  sayHi() {
    return `Hi? My name is ${name}`;
  },
}))('Lee');
console.log(person.sayHi('Oh'));

function Test(a, b) {
  this.a = a;
  b = 2;

  const est = () => {
    console.log(this.a, b); // 1, 2
  };

  return est();
}
const po = new Test(1);
console.log(po);

class Prefixer {
  constructor(prefix) {
    this.prefix = prefix;
  }

  add(arr = []) {
    // ES5 this 회피
    var that = this;
    // return arr.map(function (item) {
    //   //console.log(this);  // undefined
    //   return that.prefix + ' ' + item; // Error: Cannot read properties of undefined (reading 'prefix')
    // });

    // ES6에서의 화살표 함수 사용
    return arr.map((item) => this.prefix + item);

    // bind()메서드 사용
    return arr.map(
      function (item) {
        return this.prefix + ' ' + item;
      }.bind(this)
    );

    // Array.prototype.map()은 두번째 인자에 콜백 함수 내부의 this문제를 해결하기 위해 만들어짐.
    return arr.map(function (item) {
      return this.prefix + ' ' + item;
    }, this); // this에 바인딩된 값이 콜백 함수 내부의 this에 바인딩된다.
  }
}

const prefixer = new Prefixer('-webkit-');
console.log(prefixer.add(['transition', 'user-select']));

// 즉시 실행 함수의 this를 가리킴
(function () {
  const foo = () => console.log(this);
  foo();
}.call({ a: 1 })); // {a: 1}

// bar는 화살표함수를 반환한다. (화살표함수 중첩)
// 화살표 함수는 this 바인딩을 갖지 않는다. 따라서 즉시실행 함수의 this를 가리킨다.
(function () {
  const bar = () => () => console.log(this);
  bar()();
}.call({ b: 2 }));

// 전역 함수 foo의 상위 스코프는 전역객체이므로 this는 window를 가리킴.
const baz = () => console.log(this);
baz();

const counter = {
  num: 1,
  increase: () => ++this.num, // 객체가 아닌, 전역 객체를 가리킴. 화살표함수가 아닌 함수의 스코프를 가리키기 때문.
};
console.log(counter.increase()); // NaN

// 메서드를 정의할땐 화살표 함수보단, 메서드 축약 표현으로

// Bad
const pe = {
  name: 'Lee',
  sayHi: () => console.log(`Hi ${this.name}`), // 전역 객체의 name을 가리킴. 의도치 않은 결과가 나올 수 있음
};
pe.sayHi();

// Good
const pe2 = {
  name: 'Lee',
  sayHi() {
    console.log(`Hi ${this.name}`); // Hi Lee
  },
};

pe2.sayHi();

// 프로토타입 객체의 프로퍼티에 화살표 함수 할당하는 경우 문제
function Person(name) {
  this.name = name;
}
// Person.prototype.sayHi = () => console.log(`Hi ${this.name}`);  // 이 경우 그냥 일반함수로 할당한다.
Person.prototype.sayHi = function () {
  console.log(`Hi ${this.name}`); // Hi Lee
};
const pers = new Person('Lee');
pers.sayHi(); // Hi undefined

function Per(name) {
  this.name = name;
}

Per.prototype = {
  constructor: Per,
  sayHi() {
    console.log(`Hi ${this.name}`);
  },
};

const p = new Per('Lee');
p.sayHi();

// 클래스로 정의 메서드 축약 표현으로 / 화살표함수로 정의하면 프로토타입이 아닌 컨스트럭터로 감
class Test2 {
  name = 'Lee';
  sayHi = () => console.log(this.name);
  sayHello() {
    console.log(`Hello ${this.name}`);
  }
}
const test2 = new Test2();
test2.sayHi();
test2.sayHello();
