/**
 *  Author: Henry Liu
 *  login page, only log in one times and save user name to local database.
 *  User dont' need to fill username when he ready to log in again.
 */
(function(){
        Ti.include(Ti.App.Properties.getString('base_folder_name')+'transaction.js');
        var win = Titanium.UI.currentWindow;
        var login_page_obj = null;
        function login_page(){                               
                var self = this;       
                var window_source = 'login_page';
                win.title = 'Login';
                
                
                /**
                 *init event, display login page
                 */
                self.init = function(){
                        try{               
                                //self.init_auto_release_pool(win);
                                if(self.is_iphone_5()){
                                        win.backgroundImage = self.get_file_path('image','login_bg_iphone5.png');
                                }else{
                                        if(self.is_ipad()){
                                                win.backgroundImage = self.get_file_path('image','login_bg_ipad.png');
                                        }
                                        else{
                                                win.backgroundImage = self.get_file_path('image',self.login_background_image);
                                        }
                                }
                                                                
                                //load user name from local database
                                _init_user_name();
                                //setup username field
                                _init_user_name_field();
                                //setup password field
                                _init_password_field();
                                //set up login button
                                _init_login_btn();
                                //_init_sign_up_button();
                                _init_version_info();
                        }
                        catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 * check app's status (logout or login)
                 */
                self.check_app_logout_or_not = function(){
                        try{      
                                var db = Titanium.Database.open(self.get_db_name());
                                var my_table_name = "my_manager_user";
                                var rows = db.execute('SELECT type,name FROM sqlite_master WHERE type=? AND name=? LIMIT 1', 'table', my_table_name);
                                var manager_user_row_count = rows.getRowCount(); 
                                if(manager_user_row_count <=0){
                                        rows.close();
                                        db.close();
                                        return true;
                                }
                                rows = db.execute('select * from my_manager_user where local_login_status=1 and status_code=1 limit 1');
                                if(rows.isValidRow()){
                                        _user_name = rows.fieldByName('username');
                                        _sha1_password = rows.fieldByName('password');
                                        rows.close();
                                        db.close();
                                        return false;
                                }else{
                                        rows.close();
                                        db.close();
                                        return true;
                                }         
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.check_app_logout_or_not');
                                return true;
                        }                        
                };
                /**
                 * login event
                 */
                self.login = function(){
                        try{
                                _selected_host_index = 0;
                                //check if fill all fields
                                if((_user_name === '') || (_password === '')){
                                        self.show_message(L('message_login_fill_all_field'));
                                        return;
                                }else{                                              
                                        Ti.App.Properties.setBool('main_page_download_latest_log',false);
                                        Ti.App.Properties.setBool('bg_page_download_latest_log',false);
                                        Ti.App.Properties.setBool('login_page_download_latest_log',false);
                                        Ti.App.Properties.setBool('upload_media_file_flag',false);      
                                        Ti.App.Properties.setBool('is_displaying_file_upload_failed_alert',false);
                                        
                                        if(Ti.Network.online){//check username and password with server database
                                                _verify_account_with_online();                                       
                                        }else{//run in local when offline
                                                _verify_account_with_offline();
                                        }
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.login');
                                return;
                        }
                };
                
                var _user_name = '';
                var _password = '';
                var _sha1_password = '';
                var _user_id = 0;
                var _company_id = 0;
                var _tab_group_obj = win.tab_group_obj;
                var _first_login = win.first_login;
                var _current_basic_table_version = 0;
                var _new_host_list = [];
                var _selected_host_index = 0;

                /**
                 * init user name field
                 */
                function _init_user_name_field(){
                        try{
                                var username_field = Titanium.UI.createTextField({
                                        hintText:'Username',
                                        width:240,
                                        height:40,
                                        top:(self.screen_height/2)-60,
                                        paddingLeft:10,
                                        value:_user_name,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        keyboardType:Titanium.UI.KEYBOARD_EMAIL,
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
                                        backgroundImage:self.get_file_path('image','inputfield.png')
                                });
                                win.add(username_field);
                                username_field.addEventListener('change',function(e){
                                        _user_name = e.value;
                                });
                                username_field.addEventListener('return',function(){
                                        if((win.children[1] != undefined) && (win.children[1] != null)){
                                                win.children[1].focus();
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_user_name_field');
                                return;
                        }
                }
                /**
                 * init password field
                 */
                function _init_password_field(){
                        try{
                                var password_field = Titanium.UI.createTextField({
                                        hintText:'Password',
                                        width:240,
                                        height:40,
                                        top:(self.screen_height/2)-20,
                                        value:'',
                                        paddingLeft:10,
                                        passwordMask:true,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
                                        returnKeyType: Titanium.UI.RETURNKEY_GO,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
                                        backgroundImage:self.get_file_path('image','inputfield.png')
                                });
                                win.add(password_field);
                                password_field.addEventListener('change',function(e){
                                        _password = e.value;
                                });
                                password_field.addEventListener('return',function(){
                                        _sha1_password = Ti.Utils.sha1(_password);
                                        self.login();
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_password_field');
                                return;
                        }
                }
                /**
                 * init login button
                 */
                function _init_login_btn(){
                        try{
                                var login_button = Titanium.UI.createButton({
                                        top:(self.screen_height/2)+40,
                                        title:'Login',
                                        width:160,
                                        height:40,
                                        backgroundImage:self.get_file_path('image','BUTT_grn_off.png'),
                                        color:'#fff',
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                win.add(login_button);           
                                login_button.addEventListener('click',function(){
                                        win.children[1].blur();
                                        _sha1_password = Ti.Utils.sha1(_password);
                                        self.login();
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_login_btn');
                                return;
                        }
                }
                /**
                 * init sign up button
                 */
                function _init_sign_up_button(){
                        try{
                                var sign_up_button = Titanium.UI.createButton({
                                        top:(self.screen_height/2)+100,
                                        title:'Sign-up',
                                        width:160,
                                        height:40,
                                        backgroundImage:self.get_file_path('image','BUTT_grn_off.png'),
                                        color:'#fff',
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                win.add(sign_up_button);                                
                                sign_up_button.addEventListener('click',function(){
                                        win.children[1].blur();
                                        _sign_up();
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_sign_up_button');
                                return;
                        }                        
                }
                
                /**
                 * init version info
                 */
                function _init_version_info(){
                        try{
                                var versionInfoField = Ti.UI.createLabel({
                                        bottom:(self.is_ipad())?50:10,
                                        text:'Version ('+self.version+'.'+self.version_increment+')',
                                        width:self.screen_width,
                                        height:20,
                                        textAlign:'center',
                                        color:'#000',
                                        font:{
                                                fontSize:self.small_font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                win.add(versionInfoField);       
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_version_info');
                                return;
                        }                        
                }
                
                /**
                 * verify account online 
                 */
                function _verify_account_with_online(){
                        try{
                                self.display_indicator('Verifying Account ...',false);
                                //get basic table version number
                                var db = Titanium.Database.open(self.get_db_name());
                                var my_table_name = "my_frontend_config_setting";
                                var rows = db.execute('SELECT type,name FROM sqlite_master WHERE type=? AND name=? LIMIT 1', 'table', my_table_name);
                                var basic_table_version_row_count = rows.getRowCount(); 
                                                
                                if(basic_table_version_row_count> 0){
                                        rows.close();
                                        rows = db.execute('SELECT * from my_frontend_config_setting where name=?','basic_table_version');
                                        if(rows.isValidRow()){
                                                _current_basic_table_version = rows.fieldByName('value');
                                        }
                                }
                                rows.close();
                                db.close();    
                                if(basic_table_version_row_count <= 0){
                                        db = Titanium.Database.open(self.get_db_name());
                                        db.execute('BEGIN');
                                        _init_all_tables(db);
                                        db.execute('COMMIT');
                                        db.close();
                                }else{
                                        db = Titanium.Database.open(self.get_db_name());
                                        my_table_name = "my_job_and_quote_count_info";
                                        rows = db.execute('SELECT type,name FROM sqlite_master WHERE type=? AND name=? LIMIT 1', 'table', my_table_name);
                                        if(rows.getRowCount() > 0){
                                                db.execute('delete from '+my_table_name);
                                                db.execute('delete from sqlite_sequence where name=\''+my_table_name+'\'');
                                        } 
                                        rows.close();
                                        db.close();
                                }
                                                
                                _new_host_list = [];
                                var selected_host_url = '';
                                selected_host_url = self.get_host_url();
                                if(selected_host_url != ''){
                                        for(var i=0,j=self.host_list.length;i<j;i++){
                                                if((self.host_list[i]+self.base_backend_url) == selected_host_url){
                                                        _new_host_list.push(self.host_list[i]);
                                                        break;
                                                }
                                        }                                                        
                                        for(i=0,j=self.host_list.length;i<j;i++){
                                                if((self.host_list[i]+self.base_backend_url) != selected_host_url){
                                                        _new_host_list.push(self.host_list[i]);
                                                }
                                        }
                                }else{
                                        for(i=0,j=self.host_list.length;i<j;i++){
                                                _new_host_list.push(self.host_list[i]);                                                              
                                        }                                                        
                                }
                                _check_username_and_password();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _verify_account_with_online');
                                return;
                        }                            
                }
                
                /**
                 * verify account on local database
                 */
                function _verify_account_with_offline(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var my_table_name = "my_manager_user";
                                var rows = db.execute('SELECT type,name FROM sqlite_master WHERE type=? AND name=? LIMIT 1', 'table', my_table_name);
                                var manager_row_count = rows.getRowCount();
                                rows.close();
                                db.close();                                                  
                                if(manager_row_count > 0){                                                        
                                        db = Titanium.Database.open(self.get_db_name());
                                        rows = db.execute('SELECT * FROM my_manager_user WHERE username=? and password=? and status_code=1',(_user_name).toLowerCase(),_sha1_password);
                                        var rows_count = rows.getRowCount();
                                        if(rows_count > 0){
                                                self.update_message('Loading My Calendar ...');
                                                Ti.App.Properties.setString('current_login_user_id',rows.fieldByName('id'));
                                                Ti.App.Properties.setString('current_login_user_name',rows.fieldByName('display_name'));
                                                Ti.App.Properties.setString('current_company_id',rows.fieldByName('company_id'));
                                                Ti.App.Properties.setString('location_service_time','0');
                                                Ti.App.Properties.setBool('location_service_time_start',false);
                                                _user_id = rows.fieldByName('id');
                                                _company_id = rows.fieldByName('company_id');
                                                rows.close();
                                                                
                                                //set properties: active_material_location
                                                rows = db.execute('SELECT * FROM my_company WHERE id=?',_company_id);
                                                if(rows.isValidRow()){
                                                        Ti.App.Properties.setString('current_company_active_material_location',rows.fieldByName('active_material_location'));      
                                                }
                                                rows.close();                                                                

                                                rows = db.execute('SELECT * FROM my_login_info where id=1');
                                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                        db.execute('UPDATE my_login_info SET name=?,value=? WHERE id=1','username',_user_name);
                                                }else{
                                                        db.execute('INSERT INTO my_login_info (id,name,value)VALUES(?,?,?)',1,'username',_user_name);
                                                }
                                                rows.close();

                                                //SAVE LOGIN USER STATUS,SET STATUS IS 1,THEN IF CRASH OR SOMETHING ,CAN LOGIN AUTO
                                                db.execute('UPDATE my_manager_user SET local_login_status=1 WHERE id=?',_user_id);
                                                db.close();
                                                if(Ti.Network.online){
                                                        _download_my_jobs(_first_login);
                                                }else{
                                                        self.hide_indicator();
                                                        if(_first_login){
                                                                if(_tab_group_obj == undefined || _tab_group_obj == null){                                                                        
                                                                }else{
                                                                //_tab_group_obj.open();
                                                                }
                                                        }
                                                        win.close({
                                                                transition:Titanium.UI.iPhone.AnimationStyle.CURL_UP
                                                        });
                                                }
                                        }else{ 
                                                rows.close();
                                                db.close();
                                                self.hide_indicator();
                                                self.show_message(L('message_login_failure'));
                                                return;
                                        }                                                        
                                }else{
                                        self.hide_indicator();
                                        self.show_message(L('message_login_failure'));
                                        return;                                                        
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _verify_account_with_offline');
                                return;
                        } 
                }                                                
                
                /**
                 * connect server and check username,password
                 * if connect one server is failure and then try next host until all hosts are tried.
                 */
                function _check_username_and_password(){
                        try{
                                if(_selected_host_index >= _new_host_list.length){//if check finish all host, but still can't pass verified, then return false;'
                                        _selected_host_index = 0;
                                        //if fail to login all server, then
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var my_table_name = "my_manager_user";
                                        var rows = db.execute('SELECT type,name FROM sqlite_master WHERE type=? AND name=? LIMIT 1', 'table', my_table_name);
                                        var manager_row_count = rows.getRowCount();                                                                                               
                                        if(manager_row_count > 0){
                                                db.execute('delete from '+my_table_name);// login fail, then remove all users from manager_user table, user can't login evenif in offliine status'
                                                db.execute('delete from sqlite_sequence where name=\''+my_table_name+'\'');//set sequence number is 0
                                        }
                                        rows.close();
                                        db.close();     
                                        self.hide_indicator();
                                        self.show_message(L('message_login_failure'));                                                                                       
                                        //focus on username field when open login page¬
                                        if((win.children[0] != undefined) && (win.children[0] != null)){
                                                win.children[0].focus();
                                        }                                   
                                        return;
                                }
                                var tempURL = _new_host_list[_selected_host_index]+self.base_backend_url;
                                var xhr = null;
                                if(self.set_enable_keep_alive){
                                        xhr = Ti.Network.createHTTPClient({
                                                enableKeepAlive:false
                                        });
                                }else{
                                        xhr = Ti.Network.createHTTPClient();
                                }
                                xhr.onload = function(){
                                        try{
                                                if((xhr.readyState === 4)&&(this.status === 200)){     
                                                        if(this.responseText === null){//return false in backend's beforeAction'
                                                                self.hide_indicator();
                                                                self.show_message(L('message_login_failure'));                                                                                                                      
                                                                return;                                                        
                                                        }
                                                        if(this.responseText === '[]'){       
                                                                _selected_host_index++;
                                                                _check_username_and_password();
                                                        }else{     
                                                                var result = JSON.parse(this.responseText);
                                                                if(!result.access_allowed){
                                                                        _selected_host_index++;
                                                                        _check_username_and_password();                                                                
                                                                }else{
                                                                        var db = null;
                                                                        if((self.get_host() != _new_host_list[_selected_host_index])){
                                                                                db = Titanium.Database.open(self.get_db_name());  
                                                                                db.remove();
                                                                                db = Titanium.Database.open(self.get_db_name()); 
                                                                                db.execute('BEGIN');
                                                                                db.execute('CREATE TABLE IF NOT EXISTS my_login_info('+
                                                                                        'id INTEGER,'+
                                                                                        'name TEXT,'+
                                                                                        'value TEXT)');
                                                                                _init_all_tables(db);
                                                                                db.execute('COMMIT');
                                                                                db.close();
                                                                        }
                                                                        db = Titanium.Database.open(self.get_db_name());
                                                                        var data_rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?','host');
                                                                        if((data_rows != null) && (data_rows.getRowCount() > 0)){
                                                                                db.execute('UPDATE my_frontend_config_setting SET value=? WHERE name=?',
                                                                                        _new_host_list[_selected_host_index],
                                                                                        'host'                                                       
                                                                                        );                                               
                                                                        }else{
                                                                                db.execute('INSERT INTO my_frontend_config_setting (name,value)VALUES(?,?)',
                                                                                        'host',_new_host_list[_selected_host_index]
                                                                                        );
                                                                        }    
                                                                        var selected_host_media_index = 0;
                                                                        for(var i=0,j=self.host_list.length;i<j;i++){                                                         
                                                                                if(self.host_list[i] == _new_host_list[_selected_host_index]){
                                                                                        selected_host_media_index = i;
                                                                                        break;
                                                                                }
                                                                        }           
                                                        
                                                                        var data_rows2 = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?','host_media');
                                                                        if((data_rows2 != null) && (data_rows2.getRowCount() > 0)){
                                                                                db.execute('UPDATE my_frontend_config_setting SET value=? WHERE name=?',
                                                                                        self.host_media_list[selected_host_media_index],
                                                                                        'host_media'                                                       
                                                                                        );                                               
                                                                        }else{
                                                                                db.execute('INSERT INTO my_frontend_config_setting (name,value)VALUES(?,?)',
                                                                                        'host_media',self.host_media_list[selected_host_media_index]
                                                                                        );
                                                                        }         
                                                                        data_rows2.close();
                                                                        db.close();       
                                                        
                                                                        _selected_host_index++;                                                        
                                                                        _refresh_library_tables(this.responseText); 
                                                                        //self.hide_indicator();
                                                                        db = Titanium.Database.open(self.get_db_name());
                                                                        var rows = db.execute('SELECT * FROM my_manager_user WHERE username=? and password=? and status_code=1',(_user_name).toLowerCase(),_sha1_password);
                                                                        var rows_count = rows.getRowCount();

                                                                        if(rows_count > 0){
                                                                                self.update_message('Loading My Calendar ...');
                                                                                Ti.App.Properties.setString('current_login_user_id',rows.fieldByName('id'));
                                                                                Ti.App.Properties.setString('current_login_user_name',rows.fieldByName('display_name'));
                                                                                Ti.App.Properties.setString('current_company_id',rows.fieldByName('company_id'));                                                                                  
                                                                                _user_id = rows.fieldByName('id');
                                                                                _company_id = rows.fieldByName('company_id');                                                                                        
                                                                                rows.close();
                                                                                        
                                                                                //set properties: active_material_location
                                                                                rows = db.execute('SELECT * FROM my_company WHERE id=?',_company_id);
                                                                                if(rows.isValidRow()){
                                                                                        Ti.App.Properties.setString('current_company_active_material_location',rows.fieldByName('active_material_location'));     
                                                                                }
                                                                                rows.close();
                                                                                        
                                                                                rows = db.execute('SELECT * FROM my_login_info where id=1');
                                                                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                                                        db.execute('UPDATE my_login_info SET name=?,value=? WHERE id=1','username',_user_name);
                                                                                }else{
                                                                                        db.execute('INSERT INTO my_login_info (id,name,value)VALUES(?,?,?)',1,'username',_user_name);
                                                                                }
                                                                                rows.close();
                                                                                //SAVE LOGIN USER STATUS,SET STATUS IS 1,THEN IF CRASH OR SOMETHING ,CAN LOGIN AUTO
                                                                                db.execute('UPDATE my_manager_user SET local_login_status=1 WHERE id=?',_user_id);
                                                                                db.close();
                                                                                if(Ti.Network.online){
                                                                                        _download_basic_table_data();
                                                                                        _download_my_jobs(_first_login);
                                                                                }else{
                                                                                        self.hide_indicator();
                                                                                        if(_first_login){
                                                                                                if(_tab_group_obj == undefined || _tab_group_obj == null){
                                                                                                        
                                                                                                }else{
                                                                                                //_tab_group_obj.open();
                                                                                                }
                                                                                                win.close({
                                                                                                        transition:Titanium.UI.iPhone.AnimationStyle.CURL_UP
                                                                                                });
                                                                                        }else{
                                                                                                win.close({
                                                                                                        transition:Titanium.UI.iPhone.AnimationStyle.CURL_UP
                                                                                                });
                                                                                                Ti.App.fireEvent('pop_gps_turn_off_alert');
                                                                                        }       
                                                                                }
                                                                        }else{                            
                                                                                rows.close();
                                                                                db.close();
                                                                                self.hide_indicator();
                                                                                self.show_message(L('message_login_failure'));
                                                                        }       
                                                                }
                                                        }
                                                }else{
                                                        _selected_host_index++;
                                                        _check_username_and_password();
                                                }
                                        }catch(e){
                                                _selected_host_index++;
                                                _check_username_and_password();                                        
                                        }
                                };
                                xhr.onerror = function(e){
                                        _selected_host_index++;
                                        _check_username_and_password();
                                };                                              
                                xhr.setTimeout(self.default_time_out);
                                xhr.open('POST',tempURL+'update',false);
                                xhr.send({
                                        'type':'verify_login',
                                        'username':(_user_name).toLowerCase(),
                                        'password':_sha1_password,
                                        'refresh_num':(self.get_host() != _new_host_list[_selected_host_index])?0:_current_basic_table_version, 
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'device_platform':Ti.Platform.name,
                                        'device_model':Ti.Platform.model,
                                        'device_version':Ti.Platform.version,
                                        'device_type':self.default_device_type,     
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });     
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_username_and_password');
                                return;
                        }                         
                }
                
                /**
                 * sign up event, open signup page
                 */
                function _sign_up(){
                        try{
                                if(Ti.Network.online){
                                        Ti.Platform.openURL('http://fieldteam.com.au/signup/');
                                }else{
                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                        return;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _sign_up');
                                return;
                        }                        
                }
                                
                /**
                 * init username variable,
                 * get username from local database,
                 * user doesn't need to fill the username again when he login in next time'
                 */
                function _init_user_name(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                db.execute('CREATE TABLE IF NOT EXISTS my_login_info('+
                                        'id INTEGER,'+
                                        'name TEXT,'+
                                        'value TEXT)');
                                var rows = db.execute('SELECT * FROM my_login_info where id=1');
                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                        _user_name = rows.fieldByName('value');
                                }
                                rows.close();
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_user_name');
                                return;
                        }      
                }                
                /**
                 * upload the device token and push notification will use it.
                 */
                function _update_token(){
                        try{
                                if((!Ti.Network.online)||(Titanium.Platform.model == 'google_sdk' || Titanium.Platform.model == 'Simulator')){
                                        return;
                                }
                                if (Titanium.Platform.name == 'iPhone OS'){
                                        Titanium.Network.registerForPushNotifications({
                                                types: [
                                                Titanium.Network.NOTIFICATION_TYPE_BADGE,
                                                Titanium.Network.NOTIFICATION_TYPE_ALERT,
                                                Titanium.Network.NOTIFICATION_TYPE_SOUND
                                                ],
                                                success:function(e){
                                                        var deviceToken = e.deviceToken;
                                                        var xhr = null;
                                                        if(self.set_enable_keep_alive){
                                                                xhr = Ti.Network.createHTTPClient({
                                                                        enableKeepAlive:false
                                                                });
                                                        }else{
                                                                xhr = Ti.Network.createHTTPClient();
                                                        }
                                                        xhr.onload = function(){
                                                                try{
                                                                        if((xhr.readyState === 4)&&(this.status === 200)){                                                                         
                                                                        }else{
                                                                                return;                                                                                
                                                                        }
                                                                }catch(e){
                                                                        var params = {
                                                                                message:'',
                                                                                show_message:false,
                                                                                message_title:'',
                                                                                send_error_email:true,
                                                                                error_message:e,
                                                                                error_source:window_source+' - _update_token - success from server - 1',
                                                                                server_response_message:this.responseText
                                                                        };
                                                                        self.processXYZ(params);                                                                           
                                                                        return;
                                                                }
                                                        };
                                                        xhr.onerror = function(e){
                                                                var params = {
                                                                        message:'',
                                                                        show_message:false,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:e,
                                                                        error_source:window_source+' - _update_token - success from server - 2',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);                                                                        
                                                                return;
                                                        };
                                                        xhr.setTimeout(self.default_time_out);
                                                        xhr.open('POST',self.get_host_url()+'update',false);
                                                        xhr.send({
                                                                'type':'update_token',
                                                                'hash':_user_id,
                                                                'company_id':_company_id,
                                                                'manager_user_id':_user_id,
                                                                'token':deviceToken,
                                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                                'app_version_increment':self.version_increment,
                                                                'app_version':self.version,
                                                                'app_platform':self.get_platform_info()
                                                        });
                                                },
                                                error:function(e){
                                                        var params = {
                                                                message:'',
                                                                show_message:false,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - _update_token - error from server',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                          
                                                },
                                                callback:function(e){
                                                        var params = {
                                                                message:'',
                                                                show_message:false,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - _update_token - call back from server',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                           
                                                }
                                        });
                                }
                                if((Ti.Platform.name).toLowerCase() === 'android'){
                                        
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _update_token');
                                return;
                        }
                }
                
                function _download_basic_table_data(){
                        try{
                                var xhr = null;
                                if(self.set_enable_keep_alive){
                                        xhr = Ti.Network.createHTTPClient({
                                                enableKeepAlive:false
                                        });
                                }else{
                                        xhr = Ti.Network.createHTTPClient();
                                }
                                xhr.onload = function(){
                                        try{
                                                if((xhr.readyState === 4)&&(this.status === 200)){     
                                                        if(this.responseText === null){//return false in backend's beforeAction'                                                                                                            
                                                                return;                                                        
                                                        }
                                                        if(this.responseText === '[]'){       
                                                        }else{     
                                                                var result = JSON.parse(this.responseText);
                                                                if(!result.access_allowed){                                                         
                                                                }else{                                                      
                                                                        _refresh_basic_library_tables(this.responseText); 
                                                                }
                                                        }
                                                }
                                        }catch(e){      
                                                var params = {
                                                        message:'',
                                                        show_message:false,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _download_basic_table_data - xhr.onload',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);                                                  
                                        }
                                };
                                xhr.onerror = function(e){
                                        var params = {
                                                message:'',
                                                show_message:false,
                                                message_title:'',
                                                send_error_email:true,
                                                error_message:e,
                                                error_source:window_source+' - _download_basic_table_data - xhr.onerror',
                                                server_response_message:this.responseText
                                        };
                                        self.processXYZ(params);                                       
                                };                                              
                                xhr.setTimeout(self.default_time_out);
                                xhr.open('POST',self.get_host_url()+'update',true);
                                xhr.send({
                                        'type':'download_basic_table_data',
                                        'hash':_user_id,                                        
                                        'company_id':_company_id,
                                        'user_id':_user_id,
                                        'refresh_num':(self.get_host() != _new_host_list[_selected_host_index])?0:_current_basic_table_version, 
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()                                                
                                });
                        }catch(err){
                                self.hide_indicator();
                                self.process_simple_error_message(err,window_source+' - _download_basic_table_data');
                                return; 
                        }                           
                }
                /**
                 *  some action after success to login.
                 *  1. send user gps location.
                 *  2. update user token
                 *  3. download my jobs
                 */
                function _download_my_jobs(first_login){
                        //update user location.
                        try{
                                if(Ti.Network.online){
                                        if(Titanium.Platform.model != 'Simulator'){
                                        		Ti.API.info("send_gps_location1");
                                        		Ti.App.Properties.setString('send_gps_location1:', 'send_gps_location1');
                                                self.send_gps_location();
                                        }
                                        //if not first login, then download latest log
                                        if(!first_login){
                                                self.download_latest_log_for_login_page(false);
                                        }
                                        _update_token();//upload device token to server and ready for push notification feature
                                        var new_date = new Date();
                                        var calendar_year = new_date.getFullYear();
                                        var calendar_month = new_date.getMonth();
                                        var calendar_date = new_date.getDate();
                                        var downloaded_job_id_string = self.get_existed_job_or_quote_id_string('job',_company_id);
                                        var downloaded_quote_id_string = self.get_existed_job_or_quote_id_string('quote',_company_id);         
                                        var existed_job_id_string_in_selected_date = self.get_existed_job_or_quote_id_string_by_selected_date_and_user_id('job',_company_id,calendar_year+'-'+(((calendar_month+1)<=9)?'0'+(calendar_month+1):(calendar_month+1))+'-'+((calendar_date<=9)?'0'+calendar_date:calendar_date),_user_id);
                                        var existed_quote_id_string_in_selected_date = self.get_existed_job_or_quote_id_string_by_selected_date_and_user_id('quote',_company_id,calendar_year+'-'+(((calendar_month+1)<=9)?'0'+(calendar_month+1):(calendar_month+1))+'-'+((calendar_date<=9)?'0'+calendar_date:calendar_date),_user_id);                                        
                                        var xhr = null;
                                        if(self.set_enable_keep_alive){
                                                xhr = Ti.Network.createHTTPClient({
                                                        enableKeepAlive:false
                                                });
                                        }else{
                                                xhr = Ti.Network.createHTTPClient();
                                        }
                                        xhr.onload = function(){
                                                try{                                                     
                                                        if((xhr.readyState === 4)&&(this.status === 200)){
                                                                if(this.responseText == null){//if security session is different
                                                                        self.hide_indicator();
                                                                        var params = {
                                                                                message:L('message_login_failure'),
                                                                                show_message:true,
                                                                                message_title:'',
                                                                                send_error_email:false,
                                                                                error_message:'',
                                                                                error_source:window_source+' - _download_my_jobs - xhr.onload - 1',
                                                                                server_response_message:''
                                                                        };
                                                                        self.processXYZ(params);                                                                   
                                                                        return;                                                                        
                                                                }else{
                                                                        var temp_result = JSON.parse(this.responseText);   
                                                                        var error_string = '';
                                                                        if (!temp_result.access_allowed){       
                                                                                for(var i=0,j=temp_result.error.length;i<j;i++){
                                                                                        if(i==j){
                                                                                                error_string+=temp_result.error[i];
                                                                                        }else{
                                                                                                error_string+=temp_result.error[i]+'\n';
                                                                                        }
                                                                                }
                                                                                self.hide_indicator();
                                                                                self.show_message(error_string);  
                                                                                return;
                                                                        }else{
                                                                                if(temp_result.error != undefined &&  temp_result.error != null){
                                                                                        for(i=0,j=temp_result.error.length;i<j;i++){
                                                                                                if(i==j){
                                                                                                        error_string+=temp_result.error[i];
                                                                                                }else{
                                                                                                        error_string+=temp_result.error[i]+'\n';
                                                                                                }
                                                                                        }
                                                                                        self.hide_indicator();
                                                                                        params = {
                                                                                                message:L('message_failure_download_my_calendar'),
                                                                                                show_message:true,
                                                                                                message_title:'',
                                                                                                send_error_email:true,
                                                                                                error_message:error_string,
                                                                                                error_source:window_source+' - _download_my_jobs - xhr.onload - 2',
                                                                                                server_response_message:this.responseText
                                                                                        };
                                                                                        self.processXYZ(params);   
                                                                                        return;
                                                                                }
                                                                        }                                                                       
                                                                }       
                                                                if(self.display_app_version_incompatiable(this.responseText)){
                                                                        return;
                                                                }
                                                                self.refresh_job_and_relative_tables(this.responseText,'all');
                                                                setTimeout(function(){//
                                                                        self.hide_indicator();
                                                                        if(_tab_group_obj != undefined && _tab_group_obj != null){
                                                                                //_tab_group_obj.open();
                                                                                //self.close_window(win);
                                                                                win.close({
                                                                                        transition:Titanium.UI.iPhone.AnimationStyle.CURL_UP
                                                                                });
                                                                        }else{
                                                                                win.close({
                                                                                        transition:Titanium.UI.iPhone.AnimationStyle.CURL_UP
                                                                                });                                                                              
                                                                                Ti.App.fireEvent('pop_gps_turn_off_alert');
                                                                        }                                                                        
                                                                },2000);
                                                        }else{
                                                                self.hide_indicator();
                                                                params = {
                                                                        message:L('message_failure_download_my_calendar'),
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - _download_my_jobs - xhr.onload - 3',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);                                                                   
                                                                return;
                                                        }
                                                }catch(e){
                                                        self.hide_indicator();
                                                        params = {
                                                                message:L('message_failure_download_my_calendar'),
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - _download_my_jobs - xhr.onload - 4',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params); 
                                                        return;
                                                }
                                        };
                                        xhr.ondatastream = function(e){
                                                self.update_progress(e.progress,true);
                                        };
                                        xhr.onerror = function(e){
                                                self.hide_indicator();
                                                var params = {
                                                        message:L('message_failure_download_my_calendar'),
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _download_my_jobs - xhr.onerror',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params); 
                                                return;                                        
                                        };
                                        xhr.setTimeout(self.default_time_out);
                                        xhr.open('POST',self.get_host_url()+'update',true);
                                        xhr.send({
                                                'type':'download_my_job',
                                                'hash':_user_id,
                                                'date':calendar_year+'-'+(((calendar_month+1)<=9)?'0'+(calendar_month+1):(calendar_month+1))+'-'+((calendar_date<=9)?'0'+calendar_date:calendar_date),
                                                'company_id':_company_id,
                                                'user_id':_user_id,
                                                'source':'login',
                                                'downloaded_job_id_string':downloaded_job_id_string,
                                                'downloaded_quote_id_string':downloaded_quote_id_string,
                                                'existed_job_id_string_in_selected_date':existed_job_id_string_in_selected_date,
                                                'existed_quote_id_string_in_selected_date':existed_quote_id_string_in_selected_date,
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()                                                
                                        });
                                }else{
                                        self.hide_indicator();
                                        if(_tab_group_obj != null){
                                        //_tab_group_obj.open();
                                        }
                                        win.close({
                                                transition:Titanium.UI.iPhone.AnimationStyle.CURL_UP
                                        });                          
                                }
                        }catch(err){
                                self.hide_indicator();
                                self.process_simple_error_message(err,window_source+' - _download_my_jobs');
                                return; 
                        }            
                }
                /** 
                 *  setup and update library tables
                 */    	
                function _refresh_library_tables(responseText){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());                                
                                var result = JSON.parse(responseText);
                                if(result.StatusCode != undefined && result.StatusCode != null){
                                        deleteLibraryTables(db);
                                        self.update_selected_tables(db,'ManagerUserAgreement',result);
                                        self.update_selected_tables(db,'StatusCode',result);
                                        self.update_selected_tables(db,'ManagerUserMobileCode',result);                                        
                                }
                                
                                db.execute('BEGIN');
                                self.update_selected_tables(db,'ConfigSetting',result);
                                self.update_selected_tables(db,'Company',result);
                                self.update_selected_tables(db,'ManagerUser',result);
                                self.update_selected_tables(db,'ManagerUserMobile',result); 
                                self.update_selected_tables(db,'Summary',result); 
                                db.execute('COMMIT');                                
                                if(db != null){
                                        db.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _refresh_library_tables');
                                return;
                        }
                }  
                
                function _refresh_basic_library_tables(responseText){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());                                
                                var result = JSON.parse(responseText);
                                if(result.ClientTypeCode != undefined && result.ClientTypeCode != null){
                                        db.execute('BEGIN');
                                        self.update_selected_tables(db,'ClientTypeCode',result);
                                        self.update_selected_tables(db,'ContactTypeCode',result);
                                        self.update_selected_tables(db,'LocalityState',result);
                                        self.update_selected_tables(db,'LocalityStreetType',result);
                                        self.update_selected_tables(db,'LocalityStreetTypeAlias',result);   
                                        self.update_selected_tables(db,'OrderSourceCode',result);
                                        self.update_selected_tables(db,'SalutationCode',result);
                                
                                        self.update_selected_tables(db,'JobAssetTypeCode',result);
                                        self.update_selected_tables(db,'JobAssignedUserCode',result);
                                        self.update_selected_tables(db,'JobPriorityCode',result);
                                        self.update_selected_tables(db,'JobNoteTypeCode',result);                                
                                        self.update_selected_tables(db,'JobStatusCode',result);
                                        self.update_selected_tables(db,'JobLibraryItemTypeCode',result);
                                        self.update_selected_tables(db,'JobOperationLogTypeCode',result);
                                        self.update_selected_tables(db,'JobInvoiceStatusCode',result);
                                
                                        self.update_selected_tables(db,'QuoteAssetTypeCode',result);
                                        self.update_selected_tables(db,'QuoteNoteTypeCode',result);
                                        self.update_selected_tables(db,'QuoteStatusCode',result);
                                        self.update_selected_tables(db,'QuoteOperationLogTypeCode',result);
                                        self.update_selected_tables(db,'QuoteInvoiceStatusCode',result);
                                
                                        //suppliers type code
                                        self.update_selected_tables(db,'SupplierTypeCode',result);
                                        //purchase order status code
                                        self.update_selected_tables(db,'PurchaseOrderStatusCode',result);
                                        db.execute('COMMIT');                       
                                }
                                
                                db.execute('BEGIN');
                                self.update_selected_tables(db,'ManagerUserEmailSignature',result);                               
                                //custom report
                                self.update_selected_tables(db,'CustomReport',result); 
                                self.update_selected_tables(db,'CustomReportField',result);        
                                //materials locations
                                self.update_selected_tables(db,'MaterialsLocations',result); 
                                db.execute('COMMIT');                                
                                if(db != null){
                                        db.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _refresh_basic_library_tables');
                                return;
                        }
                }       
                
                function deleteLibraryTables(db){
                        try{
                                var tableList = [];
                                tableList.push('my_manager_user_agreement');
                                tableList.push('my_client_type_code');
                                tableList.push('my_contact_type_code');
                                tableList.push('my_locality_state');
                                tableList.push('my_locality_street_type');                        
                                tableList.push('my_locality_street_type_alias');
                                tableList.push('my_order_source_code');
                                tableList.push('my_salutation_code');
                                tableList.push('my_status_code');
                                tableList.push('my_manager_user_mobile_code');

                                tableList.push('my_job_asset_type_code');
                                tableList.push('my_job_assigned_user_code');
                                tableList.push('my_job_priority_code');
                                tableList.push('my_job_note_type_code');
                                tableList.push('my_job_status_code');                        
                                tableList.push('my_job_library_item_type_code');
                                tableList.push('my_job_operation_log_type_code');
                                tableList.push('my_job_invoice_status_code');
                        
                                tableList.push('my_quote_asset_type_code');
                                tableList.push('my_quote_note_type_code');           
                                tableList.push('my_quote_status_code');
                                tableList.push('my_quote_operation_log_type_code');           
                                tableList.push('my_quote_invoice_status_code');
                        
                                tableList.push('my_supplier_type_code');  
                                tableList.push('my_purchase_order_status_code');
                                db.execute('BEGIN');
                                for(var i=0,j=tableList.length;i<j;i++){
                                        db.execute('delete from '+tableList[i]);
                                        db.execute('DELETE FROM SQLITE_SEQUENCE WHERE name= \''+tableList[i]+'\'');
                                }
                                db.execute('COMMIT');     
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - deleteLibraryTables');
                                return;
                        }                        
                }
                
                /**
                 *  init all tables,only create table if it's not exist.
                 */
                function _init_all_tables(db){
                        try{                          
                                _init_my_updating_records_for_data_table(db);
                                _init_my_updating_errors_for_data_table(db);
                                _init_my_updating_records_table(db);
                                _init_my_updating_errors_table(db);
                                _init_my_gps_location_table(db);
                                _init_my_summary_table(db);
                                
                                _init_my_client_type_code_table(db);
                                _init_my_contact_type_code_table(db);
                                _init_my_manager_user_agreement_table(db);
                                _init_my_job_asset_type_code_table(db);
                                _init_my_job_assigned_user_code_table(db);
                                _init_my_job_note_type_code_table(db);
                                _init_my_job_priority_code_table(db);
                                _init_my_job_status_code_table(db);
                                _init_my_job_operation_log_type_code_table(db);
                                _init_my_job_library_item_type_code_table(db);
                                _init_my_job_library_item_table(db);
                                _init_my_locality_state_table(db);
                                _init_my_locality_street_type_table(db);
                                _init_my_locality_street_type_alias_table(db);
                                _init_my_order_source_code(db);

                                _init_my_salutation_code_table(db);
                                _init_my_status_code_table(db);
                                _init_my_frontend_config_setting_table(db);
                                _init_my_quote_asset_type_code_table(db);
                                _init_my_quote_note_type_code_table(db);
                                _init_my_quote_status_code_table(db);
                                _init_my_quote_operation_log_type_code_table(db);
                                _init_my_manager_user_table(db);
                                _init_my_client_table(db);
                                _init_my_client_contact_table(db);
                                _init_my_company_table(db);

                                _init_my_job_table(db);
                                _init_my_job_asset_table(db);
                                _init_my_job_assigned_user_table(db);
                                _init_my_job_client_contact_table(db);
                                _init_my_job_site_contact_table(db);
                                _init_my_job_contact_history_table(db);
                                _init_my_job_contact_history_recipient_table(db);
                                _init_my_job_note_table(db);
                                _init_my_job_operation_log_table(db);
                                _init_my_job_assigned_item_table(db);
                                _init_my_job_status_log_table(db);

                                _init_my_quote_table(db);
                                _init_my_quote_asset_table(db);
                                _init_my_quote_client_contact_table(db);
                                _init_my_quote_site_contact_table(db);
                                _init_my_quote_contact_history_table(db);
                                _init_my_quote_contact_history_recipient_table(db);
                                _init_my_quote_note_table(db);
                                _init_my_quote_assigned_user_table(db);
                                _init_my_quote_assigned_item_table(db);
                                _init_my_quote_status_log_table(db);
                                _init_my_quote_operation_log_table(db);
                                
                                //signature
                                //_init_my_job_signature_table(db);
                                //_init_my_quote_signature_table(db);  
                                //job invoice tables
                                _init_my_job_invoice_table(db);
                                _init_my_job_invoice_item_table(db);
                                _init_my_job_invoice_operation_item_table(db);
                                _init_my_job_invoice_receipt_table(db);
                                _init_my_job_invoice_receipt_status_table(db);
                                _init_my_job_invoice_status_code_table(db);
                                _init_my_job_invoice_status_log_table(db);
                                _init_my_job_invoice_template_table(db);
                                //quote invoice tables
                                _init_my_quote_invoice_table(db);
                                _init_my_quote_invoice_status_code_table(db);
                                _init_my_quote_invoice_template_table(db);   
                                //email signature
                                _init_my_manager_user_email_signature_table(db);
                                //item management tables
                                _init_my_materials_locations_table(db);
                                _init_my_materials_stocks_table(db);   
                                //manager mobile user code
                                _init_my_manager_user_mobile_code_table(db);
                                _init_my_manager_user_mobile_table(db);    
                                //invoice signature
                                _init_my_job_invoice_signature_table(db);
                                _init_my_quote_invoice_signature_table(db);
                                //custom report
                                _init_my_custom_report_table(db);
                                _init_my_custom_report_field_table(db);
                                _init_my_job_custom_report_data_table(db);
                                _init_my_quote_custom_report_data_table(db);
                                _init_my_job_custom_report_signature_table(db);
                                _init_my_quote_custom_report_signature_table(db);
                                //init labour manual item
                                _init_my_job_operation_manual_table(db);
                                _init_my_job_assigned_operation_manual_table(db);
                                _init_my_quote_operation_manual_table(db);
                                _init_my_quote_assigned_operation_manual_table(db);
                                
                                //init job count info table
                                _init_my_job_and_quote_count_info_table(db);
                                //init supplier tables
                                _init_my_supplier_type_code_table(db);
                                _init_my_suppliers_table(db);
                                _init_my_suppliers_contact_table(db);
                                //purchase order
                                _init_my_purchase_order_status_code_table(db);
                                _init_my_purchase_order_table(db);
                                _init_my_purchase_order_item_table(db);
                                //locksmith
                                _init_my_job_invoice_locksmith_table(db);
                                _init_my_job_invoice_locksmith_signature_table(db);
                        }catch(err){
                                self.process_simple_error_message(err);
                                return;
                        }
                }       
                function _init_my_basic_table_version_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_basic_table_version('+
                                'id INTEGER PRIMARY KEY,'+
                                'veresion INTEGER)');                        
                }
                function _init_my_updating_records_for_data_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_updating_records_for_data('+
                                'id REAL PRIMARY KEY,'+
                                'user_id INTEGER,'+//login user id.  system can upload file even if user logout
                                'company_id INTEGER,'+//company id of login user.system can upload file even if user logout
                                'type TEXT COLLATE NOCASE,'+//job or quote
                                'failure_times INTEGER,'+//failure times of upload.maximum is 3 times. if great than 3 times, then delete it if if upload fail.
                                'upload_status INTEGER,'+//init status set 0, start upload --- set 1 , finish upload set 2
                                'message TEXT,'+//display this message on actInd when upload to server,
                                'error_message TEXT,'+//display it when upload failure
                                'updating_id TEXT,'+//updating records's id
                                'table_name TEXT COLLATE NOCASE,'+//self source table
                                'relation_id REAL,'+//e.g. job_id is relation_id between job and job note
                                'relation_reference_number REAL,'+//eg. job reference number
                                'relation_id_field_name TEXT COLLATE NOCASE,'+//e.g job_id
                                'relation_table TEXT COLLATE NOCASE,'+//e.g. my_job
                                'created INTEGER)');//created time . if upload_status=1 , then check created time. if interval is over than 30 mins, then reset upload_status=0  
                }
                function _init_my_updating_errors_for_data_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_updating_errors_for_data('+
                                'id REAL PRIMARY KEY,'+
                                'user_id INTEGER,'+//login user id.  system can upload file even if user logout
                                'company_id INTEGER,'+//company id of login user.system can upload file even if user logout
                                'type TEXT COLLATE NOCASE,'+//job or quote                
                                'message TEXT,'+//display this message on actInd when upload to server
                                'updating_id TEXT,'+//updating records's id
                                'table_name TEXT COLLATE NOCASE,'+//self source table
                                'relation_id REAL,'+//e.g. job_id is relation_id between job and job note
                                'relation_reference_number REAL,'+//eg. job reference number
                                'relation_id_field_name TEXT COLLATE NOCASE,'+//e.g job_id
                                'relation_table TEXT COLLATE NOCASE,'+
                                'is_read INTEGER,'+//is read is error or not
                                'created INTEGER)');//e.g. my_job                                                                                                  
                }                
                function _init_my_updating_records_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_updating_records('+
                                'id REAL PRIMARY KEY,'+
                                'user_id INTEGER,'+//login user id.  system can upload file even if user logout
                                'company_id INTEGER,'+//company id of login user.system can upload file even if user logout
                                'type TEXT COLLATE NOCASE,'+//job or quote
                                'failure_times INTEGER,'+//failure times of upload.maximum is 3 times. if great than 3 times, then delete it if if upload fail.
                                'upload_status INTEGER,'+//init status set 0, start upload --- set 1 , finish upload set 2, failed is 3
                                'message TEXT,'+//display this message on actInd when upload to server,
                                'error_message TEXT,'+//display it when upload failure
                                'updating_id TEXT,'+//updating records's id
                                'table_name TEXT COLLATE NOCASE,'+//self source table
                                'relation_id REAL,'+//e.g. job_id is relation_id between job and job note
                                'relation_reference_number REAL,'+//eg. job reference number
                                'relation_id_field_name TEXT COLLATE NOCASE,'+//e.g job_id
                                'relation_table TEXT COLLATE NOCASE,'+//e.g. my_job
                                'created INTEGER)');//created time . if upload_status=1 , then check created time. if interval is over than 30 mins, then reset upload_status=0  
                }
                function _init_my_updating_errors_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_updating_errors('+
                                'id REAL PRIMARY KEY,'+
                                'user_id INTEGER,'+//login user id.  system can upload file even if user logout
                                'company_id INTEGER,'+//company id of login user.system can upload file even if user logout
                                'type TEXT COLLATE NOCASE,'+//job or quote                
                                'message TEXT,'+//display this message on actInd when upload to server
                                'updating_id TEXT,'+//updating records's id
                                'table_name TEXT COLLATE NOCASE,'+//self source table
                                'relation_id REAL,'+//e.g. job_id is relation_id between job and job note
                                'relation_reference_number REAL,'+//eg. job reference number
                                'relation_id_field_name TEXT COLLATE NOCASE,'+//e.g job_id
                                'relation_table TEXT COLLATE NOCASE,'+
                                'is_read INTEGER,'+//is read is error or not
                                'created INTEGER)');//e.g. my_job                                                                                                  
                }
                function _init_my_gps_location_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_gps_location('+
                                'id REAL PRIMARY KEY,'+
                                'user_id INTEGER,'+
                                'company_id INTEGER,'+
                                'device_type TEXT COLLATE NOCASE,'+
                                'latitude TEXT,'+    
                                'longitude TEXT,'+
                                'altitude TEXT,'+
                                'accuracy TEXT,'+
                                'altitudeAccuracy TEXT,'+
                                'heading TEXT,'+
                                'speed TEXT,'+
                                'timestamp TEXT,'+
                                'log_time TEXT)');
                }
                function _init_my_summary_table(db){                        
                        db.execute('CREATE TABLE IF NOT EXISTS my_summary('+
                                'id REAL PRIMARY KEY,'+
                                'manager_user_id INTEGER,'+
                                'company_id INTEGER,'+
                                'job_total_number_on_server TEXT,'+
                                'unassigned_job_total_number_on_server TEXT,'+
                                'my_job_total_number_on_server TEXT,'+
                                'my_job_status_number_on_server TEXT,'+
                                'job_status_number_on_server TEXT,'+
                                'quote_total_number_on_server TEXT,'+
                                'unassigned_quote_total_number_on_server TEXT,'+
                                'my_quote_total_number_on_server TEXT,'+
                                'my_quote_status_number_on_server TEXT,'+
                                'quote_status_number_on_server TEXT,'+
                                'client_number_on_server TEXT,'+
                                'business_client_number_on_server TEXT,'+
                                'private_client_number_on_server TEXT,'+
                                'client_contact_number_on_server TEXT,'+
                                'library_item_number_on_selected_location TEXT,'+
                                'library_item_number_on_server TEXT,'+
                                'suppliers_number_on_server TEXT)');
                }
                function _init_my_client_type_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_client_type_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT,'+
                                'abbr TEXT)');                                  
                }
                function _init_my_contact_type_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_contact_type_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT)');                                    
                }
                function _init_my_manager_user_agreement_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_manager_user_agreement('+
                                'id INTEGER PRIMARY KEY,'+
                                'title TEXT,'+
                                'description TEXT,'+
                                'path TEXT,'+
                                'status_code INTEGER,'+
                                'created TEXT,'+
                                'modified TEXT)');                                   
                }
                function _init_my_job_asset_type_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_asset_type_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'path TEXT,'+
                                'description TEXT)');                                  
                }
                function _init_my_job_assigned_user_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_assigned_user_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT)');                                   
                }
                function _init_my_job_note_type_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_note_type_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT)');                                   
                }
                function _init_my_job_priority_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_priority_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'abbr TEXT,'+
                                'colour TEXT,'+
                                'description TEXT)');                                 
                }
                function _init_my_job_status_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_status_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'abbr TEXT,'+
                                'colour TEXT,'+
                                'description TEXT)');                                  
                }
                function _init_my_job_operation_log_type_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_operation_log_type_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'colour TEXT,'+
                                'description TEXT)');                                  
                }
                function _init_my_job_library_item_type_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_library_item_type_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT)');                                  
                }
                function _init_my_job_library_item_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_library_item('+
                                'id REAL PRIMARY KEY,'+
                                'company_id INTEGER,'+
                                'reference_number REAL,'+
                                'job_library_item_type_code INTEGER,'+
                                'item_name TEXT COLLATE NOCASE,'+
                                'item_abbr TEXT COLLATE NOCASE,'+
                                'description TEXT,'+
                                'price NUMERIC,'+
                                'inc_gst INTEGER,'+
                                'is_gst_exempt INTEGER,'+
                                'account_external_reference TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }
                function _init_my_locality_state_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_locality_state('+
                                'id INTEGER PRIMARY KEY,'+
                                'locality_country_id INTEGER,'+
                                'state TEXT,'+
                                'state_abbr TEXT,'+
                                'url TEXT,'+
                                'latitude NUMERIC,'+
                                'longitude NUMERIC,'+
                                'point TEXT,'+
                                'boundary TEXT,'+
                                'geo_source_code INTEGER,'+
                                'geo_accuracy_code INTEGER,'+
                                'gmt_offset INTEGER,'+
                                'status_code INTEGER,'+
                                'created TEXT,'+
                                'modified TEXT)');                                 
                }
                function _init_my_locality_street_type_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_locality_street_type('+
                                'id INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT,'+
                                'status_code INTEGER,'+
                                'created TEXT,'+
                                'modified TEXT)');                                 
                } 
                function _init_my_locality_street_type_alias_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_locality_street_type_alias('+
                                'id INTEGER PRIMARY KEY,'+
                                'locality_street_type_id INTEGER,'+
                                'name TEXT,'+
                                'status_code INTEGER,'+
                                'created TEXT,'+
                                'modified TEXT)');                                 
                }                    
                function _init_my_order_source_code(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_order_source_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT)');                           
                }
                function _init_my_salutation_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_salutation_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT)');                                     
                }
                function _init_my_status_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_status_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT)');  
                }
                function _init_my_frontend_config_setting_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_frontend_config_setting('+
                                'id INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'value TEXT)');                                 
                }
                function _init_my_quote_asset_type_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_asset_type_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'path TEXT,'+
                                'description TEXT)');                                    
                }
                function _init_my_quote_note_type_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_note_type_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT)');                                   
                }
                function _init_my_quote_status_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_status_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'abbr TEXT,'+
                                'colour TEXT,'+
                                'description TEXT)');                                  
                }
                function _init_my_quote_operation_log_type_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_operation_log_type_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'colour TEXT,'+
                                'description TEXT)');                                  
                }
                function _init_my_manager_user_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_manager_user('+
                                'id REAL PRIMARY KEY,'+
                                'reference_number REAL,'+
                                'company_id INTEGER,'+
                                'display_name TEXT COLLATE NOCASE,'+
                                'display_abbr TEXT COLLATE NOCASE,'+
                                'username TEXT COLLATE NOCASE,'+
                                'password TEXT COLLATE NOCASE,'+
                                'salutation_code INTEGER,'+
                                'first_name TEXT COLLATE NOCASE,'+
                                'last_name TEXT COLLATE NOCASE,'+
                                'position TEXT COLLATE NOCASE,'+
                                'phone_mobile TEXT COLLATE NOCASE,'+
                                'phone TEXT COLLATE NOCASE,'+
                                'fax TEXT COLLATE NOCASE,'+
                                'skype_name TEXT COLLATE NOCASE,'+
                                'email TEXT COLLATE NOCASE,'+
                                'dob TEXT COLLATE NOCASE,'+
                                'introduction TEXT COLLATE NOCASE,'+
                                'photo_original TEXT,'+
                                'enable_team_view INTEGER,'+
                                'enable_notifiactions_email INTEGER,'+
                                'enable_notifications_sms INTEGER,'+
                                'enable_notifications_push INTEGER,'+
                                'rate_per_hour NUMERIC,'+
                                'tfn TEXT COLLATE NOCASE,'+
                                'date_commenced TEXT,'+
                                'employment_type_code INTEGER,'+
                                'token TEXT COLLATE NOCASE,'+
                                'agreement INTEGER,'+
                                'status_code INTEGER,'+
                                'colour TEXT COLLATE NOCASE,'+
                                'local_login_status INTEGER,'+//SAVE LOCAL LOGIN STATUS.
                                //'account_token TEXT COLLATE NOCASE,'+// md5(username)+md5(password)
                                //'security_session TEXT COLLATE NOCASE,'+ //MD5(username+password+activity)
                                'app_security_session TEXT COLLATE NOCASE,'+
                                'device_type TEXT COLLATE NOCASE,'+
                                'device_platform TEXT COLLATE NOCASE,'+
                                'device_model TEXT COLLATE NOCASE,'+
                                'device_version TEXT COLLATE NOCASE,'+
                                'app_version TEXT COLLATE NOCASE,'+                                
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                     
                }
                function _init_my_client_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_client('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'reference_number REAL,'+
                                'client_name TEXT COLLATE NOCASE,'+
                                'client_abbr TEXT COLLATE NOCASE,'+
                                'phone_mobile TEXT COLLATE NOCASE,'+
                                'phone TEXT COLLATE NOCASE,'+
                                'fax TEXT COLLATE NOCASE,'+
                                'skype_name TEXT COLLATE NOCASE,'+
                                'email TEXT COLLATE NOCASE,'+
                                'website TEXT COLLATE NOCASE,'+
                                'client_type_code INTEGER,'+
                                'description TEXT COLLATE NOCASE,'+
                                'sub_number TEXT COLLATE NOCASE,'+
                                'unit_number TEXT COLLATE NOCASE,'+
                                'street_number TEXT COLLATE NOCASE,'+
                                'street TEXT COLLATE NOCASE,'+
                                'locality_street_type_id INTEGER,'+
                                'street_type TEXT COLLATE NOCASE,'+
                                'locality_suburb_id INTEGER,'+
                                'suburb TEXT COLLATE NOCASE,'+
                                'postcode TEXT COLLATE NOCASE,'+
                                'locality_state_id INTEGER,'+
                                'latitude NUMERIC,'+//source type is decimal
                                'longitude NUMERIC,'+//source type is decimal
                                'point TEXT,'+//source type is geometry
                                'boundary TEXT,'+//source type is geometry
                                'geo_source_code INTEGER,'+
                                'geo_accuracy_code INTEGER,'+
                                'postal_address TEXT COLLATE NOCASE,'+
                                'abn TEXT COLLATE NOCASE,'+
                                'account_external_reference TEXT,'+
                                'account_mark_up NUMERIC,'+
                                'account_payment_terms TEXT,'+
                                'account_payment_comments TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                 
                }
                function _init_my_client_contact_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_client_contact('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'client_id INTEGER,'+
                                'salutation_code INTEGER,'+
                                'display_name TEXT COLLATE NOCASE,'+
                                'first_name TEXT COLLATE NOCASE,'+
                                'last_name TEXT COLLATE NOCASE,'+
                                'position TEXT COLLATE NOCASE,'+
                                'phone_mobile TEXT COLLATE NOCASE,'+
                                'phone TEXT COLLATE NOCASE,'+
                                'fax TEXT COLLATE NOCASE,'+
                                'skype_name TEXT COLLATE NOCASE,'+
                                'email TEXT COLLATE NOCASE,'+
                                'website TEXT COLLATE NOCASE,'+
                                'note TEXT COLLATE NOCASE,'+
                                'username TEXT COLLATE NOCASE,'+
                                'password TEXT COLLATE NOCASE,'+
                                'enable_login INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                 
                }
                function _init_my_company_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_company('+
                                'id INTEGER PRIMARY KEY,'+
                                'company_group_id INTEGER,'+
                                'company_name TEXT COLLATE NOCASE,'+
                                'abn TEXT COLLATE NOCASE,'+
                                'corporation_name TEXT COLLATE NOCASE,'+
                                'phone TEXT COLLATE NOCASE,'+
                                'phone_alt TEXT COLLATE NOCASE,'+
                                'fax TEXT COLLATE NOCASE,'+
                                'email TEXT COLLATE NOCASE,'+
                                'website TEXT COLLATE NOCASE,'+
                                'sub_number TEXT COLLATE NOCASE,'+
                                'unit_number TEXT COLLATE NOCASE,'+
                                'street_number TEXT COLLATE NOCASE,'+
                                'street TEXT COLLATE NOCASE,'+
                                'locality_street_type_id INTEGER,'+
                                'street_type TEXT COLLATE NOCASE,'+
                                'locality_suburb_id INTEGER,'+
                                'suburb TEXT COLLATE NOCASE,'+
                                'postcode TEXT COLLATE NOCASE,'+
                                'locality_state_id INTEGER,'+
                                'postal_address TEXT COLLATE NOCASE,'+
                                'logo_160x30 TEXT,'+
                                'website_id INTEGER,'+
                                'account_income_identifier TEXT COLLATE NOCASE,'+
                                'account_bank TEXT COLLATE NOCASE,'+
                                'account_bsb TEXT COLLATE NOCASE,'+
                                'account_number TEXT COLLATE NOCASE,'+
                                'account_name TEXT COLLATE NOCASE,'+
                                'account_payment_terms TEXT,'+
                                'account_payment_comments TEXT,'+
                                'logo_banner TEXT,'+
                                'is_gst_exempt INTEGER,'+
                                'active_material_location INTEGER,'+
                                'total_user_accounts INTEGER,'+
                                'owner_manager_user_id INTEGER,'+
                                'invoice_template_id INTEGER,'+
                                'tax TEXT COLLATE NOCASE,'+
                                'tax_amount INTEGER,'+
                                'status_code INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                    
                }
                function _init_my_job_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'client_id INTEGER,'+
                                'job_priority_code INTEGER,'+
                                'job_status_code INTEGER,'+
                                'scheduled_from TEXT,'+//source is timestamp type
                                'scheduled_to TEXT,'+//source is timestamp type
                                'reference_number REAL,'+
                                'order_reference INTEGER,'+
                                'sp TEXT COLLATE NOCASE,'+
                                'sub_number TEXT COLLATE NOCASE,'+
                                'unit_number TEXT COLLATE NOCASE,'+
                                'street_number TEXT COLLATE NOCASE,'+
                                'street TEXT COLLATE NOCASE,'+
                                'locality_street_type_id INTEGER,'+
                                'street_type TEXT COLLATE NOCASE,'+
                                'locality_suburb_id INTEGER,'+
                                'suburb TEXT COLLATE NOCASE,'+
                                'postcode TEXT COLLATE NOCASE,'+
                                'locality_state_id INTEGER,'+
                                'latitude NUMERIC,'+//source type is decimal
                                'longitude NUMERIC,'+//source type is decimal
                                'point TEXT,'+//source type is geometry
                                'boundary TEXT,'+//source type is geometry
                                'geo_source_code INTEGER,'+
                                'geo_accuracy_code INTEGER,'+
                                'title TEXT COLLATE NOCASE,'+
                                'description TEXT,'+
                                'booking_note TEXT,'+
                                'allocated_hours INTEGER,'+
                                'status_code INTEGER,'+
                                'due TEXT,'+
                                'order_source_code INTEGER,'+
                                'changed INTEGER,'+
                                'exist_any_changed INTEGER,'+
                                'is_task INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                    
                }
                function _init_my_job_asset_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_asset('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+//company_id+user_id+temp_id
                                'job_id INTEGER,'+
                                'job_asset_type_code INTEGER,'+
                                'name TEXT COLLATE NOCASE,'+
                                'description TEXT COLLATE NOCASE,'+
                                'path TEXT,'+
                                'path_original TEXT,'+
                                'mime_type TEXT COLLATE NOCASE,'+
                                'height INTEGER,'+
                                'width INTEGER,'+
                                'file_size INTEGER,'+
                                'status_code INTEGER,'+
                                'is_local_record INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }
                function _init_my_job_assigned_user_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_assigned_user('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+//company_id+user_id+temp_id
                                'job_id INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'job_assigned_user_code INTEGER,'+//source is tinyint type
                                'assigned_from TEXT,'+
                                'assigned_to TEXT,'+
                                'status_code INTEGER,'+//source is timestamp type
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                   
                }
                function _init_my_job_client_contact_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_client_contact('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'job_id INTEGER,'+
                                'client_contact_id INTEGER,'+
                                'note TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }
                function _init_my_job_site_contact_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_site_contact('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'job_id INTEGER,'+
                                'salutation_code INTEGER,'+
                                'display_name TEXT COLLATE NOCASE,'+
                                'first_name TEXT COLLATE NOCASE,'+
                                'last_name TEXT COLLATE NOCASE,'+
                                'phone_mobile TEXT COLLATE NOCASE,'+
                                'phone TEXT COLLATE NOCASE,'+
                                'phone_work TEXT COLLATE NOCASE,'+
                                'email TEXT COLLATE NOCASE,'+
                                'note TEXT COLLATE NOCASE,'+
                                'is_primary_contact INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                      
                }
                function _init_my_job_contact_history_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_contact_history('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'job_id INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'contact_type_code INTEGER,'+//source is tinyint type
                                'description TEXT,'+
                                'contacted TEXT,'+
                                'status_code INTEGER,'+//source is timestamp type
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                    
                }
                function _init_my_job_contact_history_recipient_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_contact_history_recipient('+
                                'id INTEGER PRIMARY KEY,'+
                                'job_contact_history_id INTEGER,'+
                                'contact_message_id INTEGER,'+
                                'model TEXT,'+//source is tinyint type
                                'pk_id INTEGER,'+
                                'contact TEXT,'+
                                'status_code INTEGER,'+//source is timestamp type
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                 
                }
                function _init_my_job_note_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_note('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'job_id INTEGER,'+
                                'description TEXT,'+
                                'job_note_type_code INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                 
                }
                function _init_my_job_operation_log_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_operation_log('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'job_id INTEGER,'+
                                'job_operation_log_type_code INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'description TEXT,'+
                                'latitude NUMERIC,'+
                                'longitude NUMERIC,'+
                                'point TEXT,'+//source type is geometry
                                'geo_source_code INTEGER,'+
                                'geo_accuracy_code INTEGER,'+
                                'logged TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                    
                }
                function _init_my_job_assigned_item_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_assigned_item('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'job_id INTEGER,'+
                                'job_library_item_id INTEGER,'+
                                'materials_locations_id INTEGER,'+
                                'units NUMERIC,'+
                                'item_order INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                     
                }
                function _init_my_job_status_log_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_status_log('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'job_id INTEGER,'+
                                'job_status_code INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'reason TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                    
                }
                function _init_my_quote_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'client_id INTEGER,'+
                                'quote_status_code INTEGER,'+
                                'scheduled_from TEXT,'+//source is timestamp type
                                'scheduled_to TEXT,'+//source is timestamp type
                                'reference_number REAL,'+
                                'order_reference INTEGER,'+
                                'sp TEXT COLLATE NOCASE,'+
                                'sub_number TEXT COLLATE NOCASE,'+
                                'unit_number TEXT COLLATE NOCASE,'+
                                'street_number TEXT COLLATE NOCASE,'+
                                'street TEXT COLLATE NOCASE,'+
                                'locality_street_type_id INTEGER,'+
                                'street_type TEXT COLLATE NOCASE,'+
                                'locality_suburb_id INTEGER,'+
                                'suburb TEXT COLLATE NOCASE,'+
                                'postcode TEXT COLLATE NOCASE,'+
                                'locality_state_id INTEGER,'+
                                'latitude NUMERIC,'+//source type is decimal
                                'longitude NUMERIC,'+//source type is decimal
                                'point TEXT,'+//source type is geometry
                                'boundary TEXT,'+//source type is geometry
                                'geo_source_code INTEGER,'+
                                'geo_accuracy_code INTEGER,'+
                                'title TEXT COLLATE NOCASE,'+
                                'description TEXT COLLATE NOCASE,'+
                                'booking_note TEXT COLLATE NOCASE,'+
                                'allocated_hours INTEGER,'+
                                'job_id INTEGER,'+
                                'status_code INTEGER,'+
                                'due TEXT,'+
                                'order_source_code INTEGER,'+         
                                'is_task INTEGER,'+         
                                'changed INTEGER,'+
                                'exist_any_changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                   
                }
                function _init_my_quote_asset_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_asset('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'quote_id INTEGER,'+
                                'quote_asset_type_code INTEGER,'+
                                'name TEXT COLLATE NOCASE,'+
                                'description TEXT,'+
                                'path TEXT,'+
                                'path_original TEXT,'+
                                'mime_type TEXT COLLATE NOCASE,'+
                                'height INTEGER,'+
                                'width INTEGER,'+
                                'file_size INTEGER,'+
                                'status_code INTEGER,'+
                                'is_local_record INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }
                function _init_my_quote_client_contact_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_client_contact('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'quote_id INTEGER,'+
                                'client_contact_id INTEGER,'+
                                'note TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                
                }
                function _init_my_quote_site_contact_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_site_contact('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'quote_id INTEGER,'+
                                'salutation_code INTEGER,'+
                                'display_name TEXT COLLATE NOCASE,'+
                                'first_name TEXT COLLATE NOCASE,'+
                                'last_name TEXT COLLATE NOCASE,'+
                                'phone_mobile TEXT COLLATE NOCASE,'+
                                'phone TEXT COLLATE NOCASE,'+
                                'phone_work TEXT COLLATE NOCASE,'+
                                'email TEXT COLLATE NOCASE,'+
                                'note TEXT COLLATE NOCASE,'+
                                'is_primary_contact INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                   
                }
                function _init_my_quote_contact_history_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_contact_history('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'quote_id INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'contact_type_code INTEGER,'+//source is tinyint type
                                'description TEXT,'+
                                'contacted TEXT,'+
                                'status_code INTEGER,'+//source is timestamp type
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                    
                }
                function _init_my_quote_contact_history_recipient_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_contact_history_recipient('+
                                'id INTEGER PRIMARY KEY,'+
                                'quote_contact_history_id INTEGER,'+
                                'contact_message_id INTEGER,'+
                                'model TEXT,'+//source is tinyint type
                                'pk_id INTEGER,'+
                                'contact TEXT,'+
                                'status_code INTEGER,'+//source is timestamp type
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }
                function _init_my_quote_note_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_note('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'quote_id INTEGER,'+
                                'description TEXT,'+
                                'quote_note_type_code INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                   
                }
                function _init_my_quote_assigned_user_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_assigned_user('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+//company_id+user_id+temp_id
                                'quote_id INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'job_assigned_user_code INTEGER,'+//source is tinyint type
                                'assigned_from TEXT,'+
                                'assigned_to TEXT,'+
                                'status_code INTEGER,'+//source is timestamp type
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                 
                }
                function _init_my_quote_assigned_item_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_assigned_item('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'quote_id INTEGER,'+
                                'job_library_item_id INTEGER,'+
                                'materials_locations_id INTEGER,'+
                                'units NUMERIC,'+
                                'item_order INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                   
                }
                function _init_my_quote_status_log_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_status_log('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'quote_id INTEGER,'+
                                'quote_status_code INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'reason TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }  
                function _init_my_quote_operation_log_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_operation_log('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'quote_id INTEGER,'+
                                'quote_operation_log_type_code INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'description TEXT,'+
                                'latitude NUMERIC,'+
                                'longitude NUMERIC,'+
                                'point TEXT,'+//source type is geometry
                                'geo_source_code INTEGER,'+
                                'geo_accuracy_code INTEGER,'+
                                'logged TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                    
                }
                
                
                //signature tables
                function _init_my_job_signature_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_signature('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'job_id INTEGER,'+
                                'client_name TEXT,'+
                                'path TEXT,'+
                                'time TEXT,'+
                                'mime_type TEXT,'+
                                'width INTEGER,'+
                                'height INTEGER,'+
                                'file_size INTEGER,'+
                                'is_local_record INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }  
                function _init_my_quote_signature_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_signature('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'quote_id INTEGER,'+
                                'client_name TEXT,'+
                                'path TEXT,'+
                                'time TEXT,'+
                                'mime_type TEXT,'+
                                'width INTEGER,'+
                                'height INTEGER,'+
                                'file_size INTEGER,'+                                
                                'is_local_record INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }       
                //job invoice tables
                function _init_my_job_invoice_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_invoice('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'reference_number REAL,'+
                                'job_id INTEGER,'+
                                'job_invoice_status_code INTEGER,'+
                                'job_invoice_template_id INTEGER,'+
                                'setup TEXT,'+
                                'invoice_date TEXT,'+
                                'description TEXT,'+
                                'description_items TEXT,'+
                                'description_labour TEXT,'+
                                'mark_up NUMERIC,'+
                                'discount NUMERIC,'+
                                'hidematerial INTEGER,'+
                                'hidelabour INTEGER,'+                                
                                'total_amount NUMERIC,'+
                                'payment_terms TEXT,'+
                                'payment_comments TEXT,'+
                                'path TEXT,'+
                                'account_external_reference TEXT,'+
                                'is_export INTEGER,'+
                                'is_merge_signature INTEGER,'+
                                'export_modify_time TEXT,'+                                                                
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                    
                }   
                function _init_my_job_invoice_item_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_invoice_item('+
                                'id REAL PRIMARY KEY,'+
                                'job_invoice_id INTEGER,'+
                                'job_library_item_id INTEGER,'+
                                'job_assigned_item_id INTEGER,'+
                                'item_order INTEGER,'+
                                'item_name TEXT,'+
                                'item_abbr TEXT,'+
                                'description TEXT,'+
                                'price NUMERIC,'+
                                'units NUMERIC,'+
                                'inc_gst INTEGER,'+
                                'is_gst_exempt INTEGER,'+
                                'mark_up NUMERIC,'+
                                'account_external_reference TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                              
                }
                function _init_my_job_invoice_operation_item_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_invoice_operation_item('+
                                'id REAL PRIMARY KEY,'+
                                'job_invoice_id INTEGER,'+
                                'job_operation_stopped_log_id INTEGER,'+
                                'duration NUMERIC,'+
                                'rate_per_hour NUMERIC,'+
                                'price NUMERIC,'+
                                'is_gst_exempt INTEGER,'+
                                'mark_up NUMERIC,'+
                                'manager_user_id INTEGER,'+
                                'description TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                              
                }    
                function _init_my_job_invoice_receipt_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_invoice_receipt('+
                                'id REAL PRIMARY KEY,'+
                                'local_id INTEGER,'+
                                'company_id INTEGER,'+
                                'reference_number REAL,'+
                                'job_invoice_id INTEGER,'+
                                'receipt_date TEXT,'+
                                'receipt_amount NUMERIC,'+
                                'receipt_status_code INTEGER,'+
                                'note TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                              
                }   
                function _init_my_job_invoice_receipt_status_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_invoice_receipt_status('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT,'+
                                'abbr TEXT)');                              
                }  
                function _init_my_job_invoice_status_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_invoice_status_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT,'+
                                'abbr TEXT)');                              
                }  
                function _init_my_job_invoice_status_log_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_invoice_status_log('+
                                'id INTEGER PRIMARY KEY,'+
                                'local_id INTEGER,'+
                                'job_invoice_id INTEGER,'+
                                'job_invoice_status_code INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'reason TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                              
                }                 
                function _init_my_job_invoice_template_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_invoice_template('+
                                'id INTEGER PRIMARY KEY,'+
                                'company_id INTEGER,'+
                                'reference_number INTEGER,'+
                                'name TEXT,'+
                                'description TEXT,'+
                                'is_custom INTEGER,'+
                                'show_head_detail INTEGER,'+
                                'show_abn INTEGER,'+
                                'show_address INTEGER,'+
                                'show_phone INTEGER,'+
                                'show_fax INTEGER,'+
                                'show_email INTEGER,'+
                                'show_bsb INTEGER,'+
                                'path TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                              
                }
                
                //quote invoice table
                function _init_my_quote_invoice_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_invoice('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'reference_number REAL,'+
                                'quote_id INTEGER,'+
                                'quote_invoice_status_code INTEGER,'+
                                'quote_invoice_template_id INTEGER,'+
                                'invoice_date TEXT,'+
                                'description TEXT,'+
                                'mark_up NUMERIC,'+
                                'discount NUMERIC,'+
                                'hidematerial INTEGER,'+                            
                                'total_amount NUMERIC,'+
                                'payment_comments TEXT,'+
                                'path TEXT,'+        
                                'is_merge_signature INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                    
                }  
                function _init_my_quote_invoice_status_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_invoice_status_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT,'+
                                'abbr TEXT)');                           
                }
                function _init_my_quote_invoice_template_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_invoice_template('+
                                'id INTEGER PRIMARY KEY,'+
                                'company_id INTEGER,'+
                                'reference_number INTEGER,'+
                                'name TEXT,'+
                                'description TEXT,'+
                                'path TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                              
                }    
                //email signature
                function _init_my_manager_user_email_signature_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_manager_user_email_signature('+
                                'id INTEGER PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'manager_user_id INTEGER,'+
                                'title TEXT,'+
                                'signature TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                              
                }  
                //item management tables
                function _init_my_materials_locations_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_materials_locations('+
                                'id INTEGER PRIMARY KEY,'+
                                'company_id INTEGER,'+
                                'reference_number INTEGER,'+
                                'name TEXT COLLATE NOCASE,'+
                                'description TEXT COLLATE NOCASE,'+
                                'sub_number TEXT COLLATE NOCASE,'+
                                'unit_number TEXT COLLATE NOCASE,'+
                                'street_number TEXT COLLATE NOCASE,'+
                                'street TEXT COLLATE NOCASE,'+
                                'street_type TEXT COLLATE NOCASE,'+
                                'locality_street_type_id INTEGER,'+
                                'suburb TEXT COLLATE NOCASE,'+
                                'postcode TEXT COLLATE NOCASE,'+
                                'locality_suburb_id INTEGER,'+
                                'locality_state_id INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                          
                }
                function _init_my_materials_stocks_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_materials_stocks('+
                                'id INTEGER PRIMARY KEY,'+
                                'company_id INTEGER,'+
                                'reference_number INTEGER,'+
                                'job_library_item_id INTEGER,'+
                                'materials_locations_id INTEGER,'+
                                'amount INTEGER,'+
                                'description TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                           
                }     
                //manager user mobile code
                function _init_my_manager_user_mobile_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_manager_user_mobile_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'abbr TEXT,'+
                                'name TEXT,'+
                                'description TEXT)');                         
                }
                function _init_my_manager_user_mobile_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_manager_user_mobile('+
                                'id INTEGER PRIMARY KEY autoincrement,'+
                                'system_id INTEGER,'+
                                'mobile_code INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'status_code INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                          
                } 
                //invoice signature
                function _init_my_job_invoice_signature_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_invoice_signature('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'job_id INTEGER,'+
                                'job_invoice_id INTEGER,'+
                                'client_name TEXT,'+
                                'path TEXT,'+
                                'time TEXT,'+
                                'mime_type TEXT,'+
                                'width INTEGER,'+
                                'height INTEGER,'+
                                'file_size INTEGER,'+
                                'is_local_record INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }  
                function _init_my_quote_invoice_signature_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_invoice_signature('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'quote_id INTEGER,'+
                                'quote_print_id INTEGER,'+
                                'client_name TEXT,'+
                                'path TEXT,'+
                                'time TEXT,'+
                                'mime_type TEXT,'+
                                'width INTEGER,'+
                                'height INTEGER,'+
                                'file_size INTEGER,'+    
                                'is_local_record INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }
                //custom report
                function _init_my_custom_report_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_custom_report('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+                                
                                'company_id INTEGER,'+
                                'need_signature INTEGER,'+
                                'title TEXT COLLATE NOCASE,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }
                function _init_my_custom_report_field_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_custom_report_field('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'custom_report_id INTEGER,'+
                                'field_title TEXT,'+
                                'field_type TEXT,'+
                                'field_position INTEGER,'+
                                'is_break INTEGER,'+
                                'field_option TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }  
                function _init_my_job_custom_report_data_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_custom_report_data('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'custom_report_id INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'job_id INTEGER,'+
                                'custom_report_data TEXT,'+
                                'is_merge_signature INTEGER,'+
                                'path TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }   
                function _init_my_quote_custom_report_data_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_custom_report_data('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'custom_report_id INTEGER,'+
                                'manager_user_id INTEGER,'+
                                'quote_id INTEGER,'+
                                'custom_report_data TEXT,'+
                                'is_merge_signature INTEGER,'+
                                'path TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }
                function _init_my_job_custom_report_signature_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_custom_report_signature('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'job_id INTEGER,'+
                                'job_custom_report_data_id INTEGER,'+
                                'client_name TEXT COLLATE NOCASE,'+
                                'path TEXT,'+
                                'time TEXT,'+
                                'mime_type TEXT,'+
                                'width INTEGER,'+
                                'height INTEGER,'+
                                'file_size INTEGER,'+
                                'is_local_record INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                } 
                function _init_my_quote_custom_report_signature_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_custom_report_signature('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'quote_id INTEGER,'+
                                'quote_custom_report_data_id INTEGER,'+
                                'client_name TEXT COLLATE NOCASE,'+
                                'path TEXT,'+
                                'time TEXT,'+
                                'mime_type TEXT,'+
                                'width INTEGER,'+
                                'height INTEGER,'+
                                'file_size INTEGER,'+
                                'is_local_record INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                               
                }  
                //manual labour item
                function _init_my_job_operation_manual_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_operation_manual('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'job_id INTEGER,'+
                                'operation_user TEXT COLLATE NOCASE,'+
                                'operation_time TEXT COLLATE NOCASE,'+
                                'operation_duration TEXT COLLATE NOCASE,'+
                                'operation_rate TEXT COLLATE NOCASE,'+
                                'operation_price NUMERIC,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                            
                }
                function _init_my_job_assigned_operation_manual_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_assigned_operation_manual('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'job_invoice_id INTEGER,'+
                                'job_operation_manual_id INTEGER,'+
                                'operation_user TEXT COLLATE NOCASE,'+
                                'operation_time TEXT COLLATE NOCASE,'+
                                'operation_duration TEXT COLLATE NOCASE,'+
                                'operation_rate TEXT COLLATE NOCASE,'+
                                'operation_price NUMERIC,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                            
                }
                function _init_my_quote_operation_manual_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_operation_manual('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'quote_id INTEGER,'+
                                'operation_user TEXT COLLATE NOCASE,'+
                                'operation_time TEXT COLLATE NOCASE,'+
                                'operation_duration TEXT COLLATE NOCASE,'+
                                'operation_rate TEXT COLLATE NOCASE,'+
                                'operation_price NUMERIC,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                            
                }  
                function _init_my_quote_assigned_operation_manual_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_quote_assigned_operation_manual('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'quote_print_id INTEGER,'+
                                'quote_operation_manual_id INTEGER,'+
                                'operation_user TEXT COLLATE NOCASE,'+
                                'operation_time TEXT COLLATE NOCASE,'+
                                'operation_duration TEXT COLLATE NOCASE,'+
                                'operation_rate TEXT COLLATE NOCASE,'+
                                'operation_price NUMERIC,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                            
                }  
                //save job count info for calendar,so as to display dot in week or month of calendar
                function _init_my_job_and_quote_count_info_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_and_quote_count_info('+
                                'id INTEGER PRIMARY KEY autoincrement,'+
                                'date TEXT,'+
                                'job_count INTEGER,'+
                                'quote_count INTEGER)');                          
                }
                //supplier, purchase order tables
                function _init_my_supplier_type_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_supplier_type_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT,'+
                                'abbr TEXT)');                                
                }
                function _init_my_suppliers_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_suppliers('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'reference_number REAL,'+
                                'supplier_name TEXT COLLATE NOCASE,'+
                                'supplier_abbr TEXT COLLATE NOCASE,'+                                
                                'supplier_type_code INTEGER,'+
                                'phone_mobile TEXT COLLATE NOCASE,'+
                                'phone TEXT COLLATE NOCASE,'+
                                'fax TEXT COLLATE NOCASE,'+
                                'skype_name TEXT COLLATE NOCASE,'+                                
                                'email TEXT COLLATE NOCASE,'+    
                                'website TEXT COLLATE NOCASE,'+
                                'description TEXT COLLATE NOCASE,'+
                                'sub_number TEXT COLLATE NOCASE,'+
                                'unit_number TEXT COLLATE NOCASE,'+
                                'street_number TEXT COLLATE NOCASE,'+                                
                                'street TEXT COLLATE NOCASE,'+    
                                'postcode TEXT COLLATE NOCASE,'+
                                'street_type TEXT COLLATE NOCASE,'+  
                                'suburb TEXT COLLATE NOCASE,'+ 
                                'locality_street_id INTEGER,'+
                                'locality_street_type_id INTEGER,'+
                                'locality_suburb_id INTEGER,'+
                                'locality_state_id INTEGER,'+
                                'locality_address_id INTEGER,'+
                                'latitude NUMERIC,'+//source type is decimal
                                'longitude NUMERIC,'+//source type is decimal
                                'point TEXT,'+//source type is geometry
                                'boundary TEXT,'+//source type is geometry
                                'geo_source_code INTEGER,'+
                                'geo_accuracy_code INTEGER,'+                                
                                'postal_address TEXT COLLATE NOCASE,'+
                                'abn TEXT COLLATE NOCASE,'+
                                'billing_name TEXT COLLATE NOCASE,'+       
                                'billing_sub_number TEXT COLLATE NOCASE,'+       
                                'billing_unit_number TEXT COLLATE NOCASE,'+       
                                'billing_street_number TEXT COLLATE NOCASE,'+       
                                'billing_street TEXT COLLATE NOCASE,'+    
                                'billing_street_type TEXT COLLATE NOCASE,'+  
                                'billing_suburb TEXT COLLATE NOCASE,'+   
                                'billing_postcode TEXT COLLATE NOCASE,'+
                                'billing_locality_street_id INTEGER,'+
                                'billing_locality_street_type_id INTEGER,'+
                                'billing_locality_suburb_id INTEGER,'+
                                'billing_locality_state_id INTEGER,'+
                                'billing_locality_address_id INTEGER,'+
                                'account_external_reference TEXT,'+
                                'account_mark_up NUMERIC,'+
                                'account_payment_terms TEXT,'+
                                'account_payment_comments TEXT,'+   
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }   
                function _init_my_suppliers_contact_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_suppliers_contact('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'suppliers_id INTEGER,'+
                                'display_name TEXT COLLATE NOCASE,'+
                                'salutation_code INTEGER,'+     
                                'first_name TEXT COLLATE NOCASE,'+
                                'last_name TEXT COLLATE NOCASE,'+     
                                'position TEXT COLLATE NOCASE,'+  
                                'phone_mobile TEXT COLLATE NOCASE,'+
                                'phone TEXT COLLATE NOCASE,'+
                                'fax TEXT COLLATE NOCASE,'+
                                'skype_name TEXT COLLATE NOCASE,'+                                
                                'email TEXT COLLATE NOCASE,'+ 
                                'dob TEXT,'+
                                'website TEXT COLLATE NOCASE,'+
                                'note TEXT,'+
                                'username TEXT,'+
                                'password TEXT,'+
                                'enable_login INTEGER,'+                                
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }    
                //purchase order
                function _init_my_purchase_order_status_code_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_purchase_order_status_code('+
                                'code INTEGER PRIMARY KEY,'+
                                'name TEXT,'+
                                'description TEXT,'+
                                'abbr TEXT)');                                
                }        
                function _init_my_purchase_order_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_purchase_order('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'reference_number REAL,'+                           
                                'quote_id INTEGER,'+
                                'job_id INTEGER,'+
                                'purchase_order_status_code INTEGER,'+
                                'purchase_order_template_id INTEGER,'+                                
                                'purchase_order_date TEXT,'+
                                'description TEXT COLLATE NOCASE,'+
                                'job_address TEXT COLLATE NOCASE,'+
                                'purchase_address TEXT COLLATE NOCASE,'+                                
                                'purchase_order_comments TEXT COLLATE NOCASE,'+    
                                'path TEXT COLLATE NOCASE,'+                                  
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                 
                }  
                function _init_my_purchase_order_item_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_purchase_order_item('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'reference_number REAL,'+                           
                                'purchase_order_id INTEGER,'+
                                'item_name TEXT COLLATE NOCASE,'+
                                'description TEXT,'+                            
                                'tags TEXT,'+
                                'units INTEGER,'+                    
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                 
                }  
                //locksmith
                function _init_my_job_invoice_locksmith_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_invoice_locksmith('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'company_id INTEGER,'+
                                'job_id INTEGER,'+
                                'job_invoice_status_code INTEGER,'+
                                'job_invoice_template_id INTEGER,'+
                                'o_number TEXT COLLATE NOCASE,'+
                                'acc_no TEXT COLLATE NOCASE,'+
                                'invoice_no TEXT COLLATE NOCASE,'+
                                'job_date TEXT COLLATE NOCASE,'+
                                'mjd_no TEXT COLLATE NOCASE,'+
                                'job_title TEXT COLLATE NOCASE,'+
                                'job_address TEXT,'+
                                'attendtion TEXT,'+
                                'building_name TEXT,'+                                
                                'phone TEXT,'+
                                'mobile TEXT,'+
                                'fax TEXT,'+
                                'description TEXT,'+
                                'cod INTEGER,'+
                                'is_need_cod INTEGER,'+
                                'paidcash INTEGER,'+
                                'cheque INTEGER,'+    
                                'credit_card INTEGER,'+
                                'total_price NUMERIC,'+      
                                'is_merge_signature INTEGER,'+
                                'path TEXT,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                    
                }       
                function _init_my_job_invoice_locksmith_signature_table(db){
                        db.execute('CREATE TABLE IF NOT EXISTS my_job_invoice_locksmith_signature('+
                                'id REAL PRIMARY KEY,'+
                                'local_id TEXT,'+
                                'job_id INTEGER,'+
                                'job_invoice_locksmith_id INTEGER,'+
                                'client_name TEXT,'+
                                'path TEXT,'+
                                'time TEXT,'+
                                'mime_type TEXT,'+
                                'width INTEGER,'+
                                'height INTEGER,'+
                                'file_size INTEGER,'+
                                'is_local_record INTEGER,'+
                                'status_code INTEGER,'+
                                'changed INTEGER,'+
                                'created TEXT,'+
                                'created_by INTEGER,'+
                                'modified_by INTEGER,'+
                                'modified TEXT)');                                  
                }                  
        }
    
        win.addEventListener('open',function(){
                try{
                        if(login_page_obj === null){
                                var P = function(){};
                                P.prototype = transaction_page.prototype;
                                login_page.prototype = new P();
                                login_page.prototype.constructor = login_page;
                                login_page_obj = new login_page();
                                login_page_obj.init();
                                Ti.App.Properties.setString('job_start_stop_longitude',0);
                                Ti.App.Properties.setString('job_start_stop_latitude',0);          
                                if(!login_page_obj.check_app_logout_or_not()){
                                        login_page_obj.login();
                                }                        
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        login_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());
