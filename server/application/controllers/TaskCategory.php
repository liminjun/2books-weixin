<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class TaskCategory extends CI_Controller {
    public function index() {
        $loginResult = LoginService::check();
        
        if ($loginResult['loginState'] === Constants::S_AUTH) {
            //var_dump($loginResult['userinfo']);
            $openId=$loginResult['userinfo']['openId'];

            $rows = DB::select('task_category', ['id','name']);
            
            $this->json([
                'result' => true,
                'data' => $rows
            ]);
        } else {
            $this->json([
                'result' => false,
                'data' => []
            ]);
        }
    }
}
