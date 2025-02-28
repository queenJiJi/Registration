import {useEffect, useState,useRef} from "react";
import styled from 'styled-components';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useForm} from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import FormError from "./Components/FormError";
import * as React from 'react';
import Font from 'react-font';
import {Eye,EyeOff} from 'react-feather';
import {InputGroup} from 'reactstrap';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";


function EdituserInfo()
{
  
    const navigate = useNavigate();
    // navigate('/confirmPage');
    
    const [user,setUser] = useState() 

    const phoneRegex=RegExp(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/
    );
    const schema = yup.object().shape({
        editName: yup.string()
          .required("⚠ 필수로 입력하셔야 합니다")
          .max(5,"⚠ 이름은 5글자 이하여야 합니다"),
        editID: yup.string()
        .required("⚠ 필수로 입력하셔야 합니다")
        .max(8,"⚠ 아이디는 8글자 이하여야 합니다"),
        editPW: yup.string()
        .required("⚠ 필수로 입력하셔야 합니다")
        .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "⚠ 비밀번호는 최소8글자,하나의 대문자,숫자,기호가 포함되어야 합니다"
            // "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        ),
        confirmPW: yup.string()
        .required("⚠ 필수로 입력하셔야 합니다")
        .oneOf([yup.ref('editPW'), null], "⚠ 비밀번호가 일치하지 않습니다"),
        editPhone: yup.string()
          .required("⚠ 필수로 입력하셔야 합니다")
          .matches(phoneRegex, "⚠ 전화번호 양식에 맞지않습니다")
    });
    const {register,watch,formState:{errors},handleSubmit} = useForm(
        {resolver: yupResolver(schema)}
    );
    // const [ok,setOk] = useState(false);
    const password=useRef();
    password.current= watch("editPW");
    
    const getuserInfo =JSON.parse(localStorage.getItem("user"));

    const [iconVisible,setIconVisible] = useState(false);
    const [inputType,setInputType] = useState("");
    const renderEyeIcon=()=>
    {
        console.log("rendered eyeIcon success")
        if(iconVisible===false)
        {   
            return <EyeOff width="14" height="14" viewBox="0 0 24 19  "/>
        }
        else{
            return <Eye width="14" height="14" viewBox="0 0 24 19"/>
        }
    }

    //eyeIcon Click했을때
    const eyeIconSetter=()=>
    {
        if(iconVisible===false){
            setInputType("password");
        }
        else{
            setInputType("text")
        }
    }
    
    const eyeClicked=()=>
    {
        setIconVisible(!iconVisible);
        eyeIconSetter();
    }



    //phoneCheckYn if the object is empty
    const isObjEmpty = obj => {
    if (obj === undefined || obj === null) return true
    else return Object.keys(obj).length === 0
    }
  
    //localStorage에 저장+user객체 set
    const saveUser=(data)=>{
        if(!isObjEmpty(data)){
            localStorage.setItem("user",JSON.stringify(data));
            setUser(data);
        }
    }

    //localStorage에서 정보 불러오기
    // const getUser=()=>
    // { 
    //   console.log("userInfois:",getuserInfo);
    // }

    // useEffect(
    //   ()=>{
    //     if(isObjEmpty(getuserInfo)){console.log("something went wrong")}
    //   },[]);

    //버튼 클릭시(= form이 submit이 될때) safeuser 호출
    const clickHandler=(val)=>{
        // console.log('clickHandler')
        if(isObjEmpty(errors)){ //error가 없을 때
            const elem = { 
                name: val.editName,
                id : val.editID,
                pw: val.editPW,
                phone: val.editPhone
            }
            saveUser(elem);
            completedPopup(elem.name);
            navigate('/editComplete');
        }
        else return "something went wrong";
    }  

    

    //회원가입 완료/실패 popup창
    const completedPopup=(username)=>
    {
        // console.log('phoneCheckYn > ', phoneCheckYn)
        // if(phoneCheckYn) {
            if(isObjEmpty(errors))
            {
                const id=toast("", {autoClose:0.3})
                toast.update(id,{ render: `${username}님, 수정된 정보가 저장되었습니다` ,type:"success" },
                {
                    autoClose:3000,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                });
            }
            
            else{
                toast.error("회원정보 수정에 실패하였습니다!",
                {
                    autoClose:1000,
                    closeOnClick:true,
                    pauseOnHover:true,
                    draggable:true,
                } );
            }
        }
    // }
    

    const [userData,setUserdata] = useState(
    { 
        name:getuserInfo.name,
        id: getuserInfo.id,
        pw: getuserInfo.pw,
        phone:getuserInfo.phone
    });
  
    return(
      <Container>
           
        <form onSubmit={handleSubmit(clickHandler)} >
         <Wrapper>
            <Font family="Jua"> 
            <div className="edit">회원정보 수정하기</div>
            </Font>

            <Contentbox>
            <label htmlFor="editName" className="editName"> 🍀 이름 </label>
            <div></div>
            <Inputbox
                name="editName"
                placeholder="이름을 입력하세요" 
                id="editName"
                defaultValue={userData.name}
                // onChange={e=>handleChange(e)}
                {...register("editName",
                // {
                //     // required:true,
                //     maxLength:{value:5}
                // }
                )}
            >
            </Inputbox>
            {<FormError message={errors.editName?.message}/>}
            {/* {errors.editName && errors.editName.type==="required" && 
                <FormError message="⚠ 필수로 입력하셔야 합니다"/>} */}
            {/* {errors.editName && errors.editName.type==="maxLength" && 
                <FormError message="⚠ 이름은 5글자 이하여야 합니다"/>} */}
            <br />

            <label htmlFor="editID" className="editID"> 🍀 아이디 </label>
            <div></div>
            <Inputbox
                name="editID"
                placeholder="아이디를 입력하세요" 
                id="editID"
                defaultValue={userData.id}

                {...register("editID",
                // {
                //     // required:true,
                //     maxLength:{value:8}
                // }
                )}
            >
            </Inputbox>
            {<FormError message={errors.editID?.message}/>}
            {/* {errors.editID && errors.editID.type==="required" && 
                <FormError message="⚠ 필수로 입력하셔야 합니다"/>} */}
            {/* {errors.editID && errors.editID.type==="maxLength" && 
                <FormError message="⚠ 아이디는 8글자 이하여야 합니다"/>} */}
            <br />

            <label htmlFor="editPW" className="editPW"> 🍀 비밀번호 </label>
            <div></div>
            <div>
                <InputGroup> 
                    <Inputbox
                        style={{width:'65%'}} 
                        placeholder="비밀번호를 입력하세요"
                        name="editPW"
                        id="editPW"
                        type={inputType}
                           {...register("editPW",
                        //    {
                        //        required:true,
                        //        maxLength:{value:6}
                        //     }
                        )}
                    />
                    <Button type="button" onClick={eyeClicked}>
                        {renderEyeIcon()}
                    </Button>
                </InputGroup>
                {<FormError message={errors.editPW?.message}/>}
                {/* {errors.editPW && errors.editPW.type==="required" && 
                <FormError message="⚠ 필수로 입력하셔야 합니다"/>}
                {errors.editPW && errors.editPW.type==="maxLength" &&
                <FormError message="⚠ 비밀번호는 6글자 이하여야 합니다"/>} */}
            </div>
            <br />            

            <label htmlFor="confirmPW" className="confirmPW"> 🍀 비밀번호 재확인 </label>
            <div></div>
            <Inputbox 
                name="confirmPW"
                placeholder="비밀번호를 다시 입력하세요" 
                id="confirmPW"
                type="password"

                {...register("confirmPW",
                // {
                //     required:true,
                //     validate: (value)=>((value) === password.current)
                // }
                )}
            >
            </Inputbox>
            {<FormError message={errors.confirmPW?.message}/>}

            {/* {errors.confirmPW && errors.confirmPW.type==="required" && 
                <FormError message="⚠ 필수로 입력하셔야 합니다"/>}
            {errors.confirmPW && errors.confirmPW.type==="validate" &&
                <FormError message="⚠ 비밀번호가 일치하지 않습니다"/>} */}
            <br/>


            <label htmlFor="editGender" className="editGender"> 🍀 성별 </label>
            <div>
                <Genderselection>
                    <option value="Female">여자</option>
                    <option value="Male">남자</option>
                    <option value="Other">기타</option>
                </Genderselection>
            </div> 
              
            <br />

            <label htmlFor="editPhone" className="editPhone"> 🍀 전화번호 </label>
            <div></div>

            <div>

            <Inputbox 
                name="editPhone"
                placeholder="전화번호를 입력하세요" 
                id="editPhone"
                // type="number"
                defaultValue={userData.phone}
                {...register("editPhone",
                // {
                //     // required:true,
                //     pattern: /[0-9]/g,
                //     // minLength:{value:11}
                //     // /[0-9]/g
                // }
                )}
            >
            </Inputbox>
            {"\u00a0\u00a0"}
            {<FormError message={errors.editPhone?.message}/>}

           
                <div></div>
            </div>
                

            <RegisterBtn type="submit">저장하기</RegisterBtn>
           
            </Contentbox>

         </Wrapper>
         </form>
             <ToastContainer />
      </Container>
    );
}

export default EdituserInfo;

const Container = styled.div`
    box-sizing: border-box;
    position: absolute;
    top: 45%;
    left: 50%;

    transform: translate(-50%,-50%);
    background: #fff;
    border-radius: 15px;
    margin-top:30px;
    background-color: #FCF9FA;
    width: 600px;
    height: 780px;
`

const Wrapper = styled.div`
    position: relative;
    width: 600px;
    height:700px;

    .edit {
        font-weight:800;
        font-size:35px;
        color:black;
        text-align:center;
        margin-top:30px;}
    }
`

const Contentbox = styled.div`
    height: 300px;
    margin-top:20px;
    text-align:center;
    padding: 17px 30px;
    


    .editName, .editID, .editPW, .confirmPW, .editGender, .editPhone {
    color:black;
    font-weight:800;
    font-size: 15px;
    margin-bottom:50px;
    border-radius:4px;
    position: relative;
    top:-2px;
    right: 32%;
    }

    .editName {left:-33%}

    .editPW {left:-31%}

    .confirmPW {left:-26%}

    .editGender {left:-33.5%}

    .editPhone {left:-30%}

    .editID {left:-32%}

`

const Inputbox = styled.input`
    width:70%;
    height:20px;
    ::placeholder{color:grey;}
    background:#F0F0F0;
    right:40%;
    
    border-radius: 4px;
    border: 1px solid white;
    padding: 8px 30px;
    font-size: 14px;
    max-width: 400px;
    display:inline;
`


const Button= styled.button`
    border-radius: 3px;
    border: 3px solid darkgrey;
    width: 30px;
    height: 35px;

    text-align: center;
    justify-items:center;

    img{
        width:15px;
        height:15px;
    }
`


const RegisterBtn = styled.button`
    width: 50%;
    height: 48px;
    border-radius: 24px;
    background: #F08080;
    color: #fff;
    margin-top: 20px;
    font-size:20px;
    border: 1px solid #BD5E7A;
    &:hover{
        background:#ea657c;
    }
`

const Genderselection = styled.select`
    width: 300px;
    margin:10px;
    height: 32px;
    color:black;
    border: 2px solid black;

    &:focus{
        font-weight:600;
    }
`
