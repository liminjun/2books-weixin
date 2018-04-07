<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class Task extends CI_Controller {
    public function create() {
        $loginResult = LoginService::check();
        $postData=json_decode(file_get_contents("php://input"),true);
        //var_dump($postData);
        $categoryId=$postData['categoryId'];
        
        $categoryName=$postData['categoryName'];
        
   
        date_default_timezone_set("PRC");

        $startTimeFormat=substr(strval($postData['startTime']),0,10);

        $startTime=date("Y-m-d H:i:s",intval($startTimeFormat));

        $endTimeFormat=substr(strval($postData['endTime']),0,10);
        $endTime=date("Y-m-d H:i:s",intval($endTimeFormat));
        

        $createdAt=date("Y-m-d H:i:s"); 
        $updatedAt=date("Y-m-d H:i:s"); 


        if ($loginResult['loginState'] === Constants::S_AUTH) {
            //var_dump($loginResult['userinfo']);
            $openId=$loginResult['userinfo']['openId'];

            
            $rows = DB::insert('task', ['open_id'=>$openId,'category_id'=>intval($categoryId),'category_name'=>$categoryName,'start_time'=>$startTime,'end_time'=>$endTime,'created_by'=>$openId,'created_at'=>$createdAt,'updated_at'=>$updatedAt]);
            
            $this->json([
                'result' => true,
                'data' => $rows==1?true:false,
                'message'=>'ok'
            ]);
        } else {
            $this->json([
                'result' => false,
                'data' => [],
                'message'=>'未登录，请重新登录'
            ]);
        }
    }
}