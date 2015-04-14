/**
 *  Description: job filter, user can query any job
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'transaction.js');
        var win = Titanium.UI.currentWindow;
        var task_list_page_obj = null;
        function task_list_page(){
                var self = this;
                var window_source = 'task_list_page';
                win.title = 'Task List';
                                  
                //public method
                /**
                 *  override init  function of parent class: transaction.js
                 */                    
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Refresh','Main,Back');
                                //call init_table_view function of parent class: transaction.js
                                self.init_table_view('plain',20);  
                                self.init_no_result_label();
                                self.init_load_data_event();
                                Ti.App.addEventListener('refresh_task_list',function(){
                                        Ti.API.info('refresh_task_list event');
                                        self.display();                                        
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };                          
                /**
                 *  override nav_right_btn_click_event  function of parent class: transaction.js
                 */                    
                self.nav_right_btn_click_event = function(e){
                        try{
                                self.init_load_data_event();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }
                };                    
                /**
                 *  override table_view_click_event  function of parent class: transaction.js
                 */                    
                self.table_view_click_event = function(e){
                        try{
                                var new_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','task/edit_task.js'),
                                        type:_type,
                                        action_for_job:'edit_job',
                                        job_id:self.data[e.index].job_id,
                                        job_reference_number:self.data[e.index].job_reference_number,
                                        job_status_code:self.data[e.index].job_status_code,
                                        parent_win:win
                                });
                                Ti.UI.currentTab.open(new_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }		
                }; 
                
                self.init_load_data_event = function(){
                        try{
                                self.display_indicator('Loading Data ...');
                                var existed_task_id_string = _get_existed_task_id('job');                
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
                                                        Ti.API.info(this.responseText);
                                                        if(self.return_to_login_page_if_user_security_session_changed(this.responseText)){
                                                                return;
                                                        }                                        
                                                        if(self.display_app_version_incompatiable(this.responseText)){
                                                                Ti.App.Properties.setBool('lock_table_flag',false);                                                
                                                                return;
                                                        }                                       
                                                        self.refresh_job_and_relative_tables(this.responseText,'job');      
                                                        Ti.App.Properties.setBool('lock_table_flag',false);
                                                        self.hide_indicator(); 
                                                        self.display();                                                               
                                                }else{
                                                        Ti.App.Properties.setBool('lock_table_flag',false);                                              
                                                        self.hide_indicator();                                                        
                                                }
                                        }catch(e){    
                                                Ti.App.Properties.setBool('lock_table_flag',false);
                                                self.process_simple_error_message(e,window_source+' - self.init_load_data_event -xhr.onload - 1');                                                
                                                self.hide_indicator();
                                        }
                                };
                                xhr.onerror = function(e){
                                        self.process_simple_error_message(e,window_source+' - self.init_load_data_event -xhr.onerror');
                                        Ti.App.Properties.setBool('lock_table_flag',false);
                                        self.hide_indicator();
                                        return;
                                };
                                xhr.setTimeout(self.default_time_out);
                                xhr.open('POST',self.get_host_url()+'update',false);
                                xhr.send({
                                        'type':'download_my_task',
                                        'hash':Ti.App.Properties.getString('current_login_user_id'),
                                        'company_id':_selected_company_id,
                                        'user_id':_selected_user_id,                                        
                                        'existed_task_id_string':existed_task_id_string,
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_load_data_event');
                                Ti.App.Properties.setBool('lock_table_flag',false);    
                                self.hide_indicator();
                                return;
                        }
                };               
                /**
                 *  display list
                 */                    
                self.display = function(){
                        try{                                                                         
                                //has been displayed id array
                                self.data = [];
                                self.table_view.setData([]);                             
                                _get_task_list(); 
                                if(self.data.length > 0){
                                        self.no_result_label.visible = false;
                                }else{
                                        self.no_result_label.visible = true;
                                }                                
                                self.table_view.setData(self.data,{
                                        animationStyle:Titanium.UI.iPhone.RowAnimationStyle.DOWN
                                });
                                setTimeout(function(){
                                        self.hide_indicator();
                                },500);                                
                        }catch(err){
                                self.hide_indicator();
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return; 
                        }                        
                };
                                                                                                                     
                //private member
                var _type = (win.type === undefined)?'job':win.type;
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');

                //private methods      
                function _get_existed_task_id(jobType){
                        try{
                                var temp_task_id_array = [];
                                var db = Titanium.Database.open(self.get_db_name());                
                                var rows = db.execute('SELECT * FROM my_'+jobType+' where is_task=1 and company_id=?',_selected_company_id);
                                while(rows.isValidRow()){
                                        temp_task_id_array.push(rows.fieldByName('id'));
                                        rows.next();
                                }
                                rows.close();  
                                db.close();
                                if(temp_task_id_array.length > 0){
                                        return temp_task_id_array.join(',');
                                }
                                return '';
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_existed_task_id');
                                return '';
                        }
                }        
                
                /**
         *  get job list or quote list which's assigen_from is null
         */
                function _get_task_list(){
                        try{
                                var sql = '';
                                var sql_params ={
                                        is_task:true,
                                        is_calendar:false,//in calendar or in filter
                                        is_scheduled:false,//query assigned_from is not null
                                        is_check_changed:false,//check changed field or not
                                        is_check_self_job:true,//only check current user's job                                             
                                        order_by:'my_'+_type+'.reference_number desc',
                                        extra_left_join_condition:'',
                                        extra_where_condition:'',
                                        type:_type,
                                        user_id:_selected_user_id,
                                        company_id:_selected_company_id,
                                        job_status_code:'-1'
                                };
                                sql = setup_sql_query_for_display_job_list(sql_params);
                                Ti.API.info('sql:'+sql);
                                if(sql != ''){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute(sql);
                                        var b = 0;
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){                                                                 
                                                        var params = {
                                                                is_header:(b === 0)?true:false,
                                                                header_text:'',
                                                                job_type:_type,
                                                                job_title:rows.fieldByName('title'),
                                                                job_id:rows.fieldByName('id'),
                                                                job_reference_number:rows.fieldByName('reference_number'),
                                                                job_status_code:rows.fieldByName(_type+'_status_code'),
                                                                class_name:'show_'+_type+'_row_'+b,
                                                                assigned_from_hours:'',
                                                                assigned_from_minutes:'',
                                                                assigned_to_hours:'',
                                                                assigned_to_minutes:'',
                                                                job_status_color:'',
                                                                job_status_name:'',
                                                                job_status_description:'',                                                                
                                                                sub_number:rows.fieldByName('sub_number'),
                                                                unit_number:rows.fieldByName('unit_number'),
                                                                street_number:rows.fieldByName('street_number'),
                                                                street:rows.fieldByName('street'),
                                                                street_type:rows.fieldByName('street_type'),
                                                                suburb:rows.fieldByName('suburb'),
                                                                postcode:rows.fieldByName('postcode')        
                                                        };                    
                                                        self.data.push(_setup_job_row_for_job_list(params));
                                                        b++;
                                                        rows.next();  
                                                }                                                                              
                                        }
                                        rows.close();
                                        db.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_task_list');
                                return; 
                        }
                }    
                
                function setup_sql_query_for_display_job_list(params){
                        try{
                                params.is_task = (params.is_task === undefined)?false:params.is_task;
                                params.is_search = (params.is_search === undefined)?false:params.is_search;
                                var select_str='',where_str=' WHERE ',order_str=' order by '+params.order_by;
                                if((params.is_calendar != undefined) && (params.is_calendar)){
                                        select_str += ' SELECT my_'+params.type+'.*,my_'+params.type+'_assigned_user.assigned_from as assigned_from,my_'+params.type+'_assigned_user.assigned_to as assigned_to FROM my_'+params.type;
                                        select_str += ' left join my_'+params.type+'_assigned_user on (my_'+params.type+'_assigned_user.status_code=1 ';
                                }else{
                                        //select all jobs, while get min(assigned_from) and max(assigned_to) from all assigned_user
                                        select_str += ' SELECT my_'+params.type+'.* ';
                                        select_str += ' FROM my_'+params.type;
                                        if((params.is_check_self_job != undefined) && (params.is_check_self_job)){
                                                select_str+= ' inner join my_'+params.type+'_assigned_user as b on (b.manager_user_id='+params.user_id+' and b.'+params.type+'_id = '+'my_'+params.type+'.id)';
                                        }                                        
                                }
                                where_str += ' my_'+params.type+'.company_id='+params.company_id+' and my_'+params.type+'.status_code=1 ';
                                if(params.is_task){
                                        where_str += ' and my_'+params.type+'.is_task=1';
                                }else{
                                        where_str += ' and my_'+params.type+'.is_task=0';
                                }                

                                if((params.extra_where_condition != undefined) &&(params.extra_where_condition != '')){
                                        where_str += ' and '+params.extra_where_condition+' ';
                                }
                                if((params.job_status_code != undefined) && (params.job_status_code != -1)){
                                        where_str += ' and my_'+params.type+'.'+params.type+'_status_code='+params.job_status_code+' ';
                                }
                                return select_str+where_str+order_str;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - setup_sql_query_for_display_job_list');
                                return '';
                        }
                }                
                
                function _setup_job_row_for_job_list(params){
                        try{
                                var row = Ti.UI.createTableViewRow({
                                        height:'auto',
                                        job_type:params.job_type,
                                        className:params.class_name, 
                                        job_id:params.job_id,
                                        job_reference_number:params.job_reference_number,
                                        job_status_code:params.job_status_code
                                });
                                if(params.is_header){
                                        row.header = params.header_text;
                                }                
                                var status_colour_label = Ti.UI.createLabel({
                                        top:0,
                                        height:70,
                                        width:10,
                                        left:0,
                                        backgroundColor:params.job_status_color
                                });
                                row.add(status_colour_label);

                                var sub_number = params.sub_number;
                                var unit = params.unit_number;
                                if((unit === '')||(unit === null)){
                                        unit = '';
                                }else{
                                        if((sub_number === '') || (sub_number === null)){
                                                unit = unit+'/';
                                        }else{
                                                unit = unit+'-'+sub_number+'/';
                                        }
                                }

                                var street_no = params.street_number;
                                street_no = ((street_no === '')||(street_no === null))?'':street_no;

                                var street_type = params.street_type;
                                var street = (params.street === null)?'':self.trim(params.street);
                                street = self.display_correct_street(street,street_type);
                                var suburb = params.suburb;
                                suburb = (suburb === null)?'':suburb;
                                var postcode = params.postcode;
                                postcode = (postcode === null)?'':postcode;                
                                var address = '';
                                if(street === ''){
                                        address = '(Blank)';
                                }else{
                                        address = unit+street_no+' '+street+', '+suburb+(postcode == ''?'':' '+postcode);
                                }
                                if(address != ''){
                                        address = address.toUpperCase();
                                }

                                var job_reference_number = Ti.UI.createLabel({
                                        height:20,
                                        width:self.screen_width-80,
                                        left:15,
                                        top:5,
                                        textAlign:'left',
                                        text:'No. - '+params.job_reference_number,
                                        font:{
                                                fontSize:self.normal_font_size,
                                                fontWeight:self.font_weight
                                        }
                                });
                                row.add(job_reference_number);                                

                                var job_address = Ti.UI.createLabel({
                                        height:20,
                                        width:self.screen_width-80,
                                        left:15,
                                        top:25,
                                        textAlign:'left',
                                        text:address,
                                        font:{
                                                fontSize:self.middle_font_size
                                        }
                                });
                                row.add(job_address);

                                //var job_description_len = (rows.fieldByName('description') != '')?rows.fieldByName('description').length:0;
                                var job_title= Ti.UI.createLabel({
                                        height:20,
                                        width:self.screen_width-80,
                                        left:15,
                                        top:45,
                                        textAlign:'left',
                                        text:params.job_title,
                                        font:{
                                                fontSize:self.middle_font_size
                                        }
                                });
                                row.add(job_title);
                                params = null;
                                return row;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_job_row_for_job_list');
                                return null;
                        }
                }              
        }
           
        win.addEventListener('open',function(){
                try{                        
                        if(task_list_page_obj === null){
                                var F = function(){};
                                F.prototype = transaction_page.prototype;
                                task_list_page.prototype = new F();
                                task_list_page.prototype.constructor = task_list_page;
                                task_list_page_obj = new task_list_page();
                                task_list_page_obj.init();
                        }else{
                                task_list_page_obj.display();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        task_list_page_obj.close_window();
                        task_list_page_obj = null;
                        win = null; 
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());

