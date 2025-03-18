import { useState,useEffect,useRef } from "react";

export default function Login(){
    const [val,setval]=useState({
        id:"",
        ps:"",
        psVisible:false,
        psOrIdError:false
    })
    const changeVal=(e)=>{
        const {name,value}=e.target
        setval({
            ...val,
            [name]:value
        })
    }
    const idLb=useRef();
    const psLb=useRef();
    useEffect(() => {
        const changerFocus=(lb,val)=>{
            if(val) lb.current.classList.add("is_focus")
            else    lb.current.classList.remove("is_focus") 
        }
        changerFocus(idLb,val.id)
        changerFocus(psLb,val.ps)
    }, [val.id,val.ps])
    const textFunc=(LB,val)=>({
        enter:()=>LB.current.classList.add("is_focus"),
        sort:()=>val ? "": LB.current.classList.remove("is_focus")
    })
    return(
        <div className="flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-r from-blue-600 via-blue-900 to-violet-700">
      <form
        id="form"
        className="bg-white rounded-3xl block"
        style={{ height: '62.5vh', width: '75vh' }}
        onSubmit={(e) => {
            e.preventDefault();
            
            
        }}
      >
        <h1 className="p-4 border-b-2 border-gray-300 text-center text-4xl font-bold">
          Login
        </h1>
        <div className="p-10">
          <input
            type="text"
            id="id_input"
            name="id"
            value={val.id}
            onMouseEnter={()=>textFunc(idLb).enter()}
            onMouseLeave={()=>textFunc(idLb,val.id).sort()}
            onChange={(e) => changeVal(e)}
            className={"outline-none border-b-2 w-full pl-2 border-"+(val.psOrIdError ? "red": "gray")+"-300"}
          />
          <label
            onMouseEnter={()=>textFunc(idLb).enter()}
            onMouseLeave={()=>textFunc(idLb,val.id).sort()}
            ref={idLb}
            htmlFor="id_input"
            className="block translate-x-2 -translate-y-8 transition-all text-gray-400 w-fit text-md mb-4"
          >
            Matricule
          </label>
          <input
            type={val.psVisible ? "text" : "password"}
            id="ps_input"
            name="ps"
            value={val.ps}
            onMouseEnter={()=>textFunc(psLb).enter()}
            onMouseLeave={()=>textFunc(psLb,val.ps).sort()}
            onChange={(e) => changeVal(e)}
            className={"outline-none border-b-2 w-full pl-2 border-"+(val.psOrIdError ? "red": "gray")+"-300"}
            maxLength="35"
          />
          <i className={"fa-solid text-blue-600 position-absolute mt-1 -ml-96 "+(val.psVisible ? "fa-eye" : "fa-eye-slash")}
             id="icon"
             name="psVisible"
             onClick={()=>setval({
                ...val,
                psVisible:!val.psVisible
             })}
          ></i>   
          <label
            onMouseEnter={()=>textFunc(psLb).enter()}
            onMouseLeave={()=>textFunc(psLb,val.ps).sort()}
            ref={psLb}
            htmlFor="ps_input"
            className="block translate-x-2 -translate-y-8 transition-all text-gray-400 w-fit text-md"
          >
            Password
          </label>
          {
            val.psOrIdError ? <div className=" text-red-700 px-1 -mt-4 pb-3 rounded relative" role="alert">
                <strong className="font-bold">Password or Matricule incorrect!</strong>
            </div> : <pre className="px-1 -mt-4 pb-3"> </pre>
          }
          <div className="text-gray-600 w-fit text-md translate-x-2 mb-6 cursor-pointer hover:text-gray-500">
            Forgot Password?
          </div>
          <button
            type="submit"
            className="w-full h-14 text-xl font-bold bg-blue-700 rounded-full text-white hover:bg-blue-600 "
          >
            Login
          </button>
        </div>

      </form>
    </div>
    )
}