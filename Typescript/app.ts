export {};
let a:number|string = "xhfhjds";
let b = "Suyash"
let c:string = "KC"
let d:boolean = true
let e:Array<number> = [1, 23, 455, 67,]
let f:[number, string] = [1, "Suyash"]
let g:any = "Suyash"
let h:unknown = "Suyash"
g - 10
h = 10
console.log(g.toUpperCase())

if (typeof h === "string") {
    console.log(h.toUpperCase())
}
// let x:number "Suyash"

interface person {
    name:string
    age?:number;
}

interface student extends person{
    readonly id:number
    grade:string
    college:string
}

let user:student= {
    name:"Suyash",
    id:2134,
    grade:"A",
    college:"PU"
}

function sum(x:number,y:number):number{
    return x+y;
}
console.log(sum(1,10))
