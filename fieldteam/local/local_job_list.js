(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'transaction.js');
        var win = Titanium.UI.currentWindow;
        var local_job_list_page_obj = null;
        function local_job_list_page(){
                var self = this;
                var window_source = 'local_job_list_page';
                win.title = 'Unsynced '+self.ucfirst(win.type)+' List';
                                                                             
                //public method
                /**
                 *  override init  function of parent class: transaction.js
                 */                    
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Add','Main,Back');
                                self.init_vars();
                                //call init_table_view function of parent class: transaction.js
                                self.init_table_view('plain');  
                                //call init_no_result_label function of parent class: fieldteam.js
                                self.init_no_result_label();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 *  override init_vars  function of parent class: transaction.js
                 */                  
                self.init_vars = function(){
                        try{
                                var temp_var = {};
                                var db = Titanium.Database.open(self.get_db_name());
                                var status_code_rows = db.execute('SELECT * FROM my_'+_type+'_status_code');
                                if(status_code_rows != null){
                                        while(status_code_rows.isValidRow()){
                                                temp_var = {
                                                        code:status_code_rows.fieldByName('code'),
                                                        colour:status_code_rows.fieldByName('colour'),
                                                        name:status_code_rows.fieldByName('name'),
                                                        description:status_code_rows.fieldByName('description')
                                                };
                                                _status_code_array.push(temp_var);
                                                status_code_rows.next();
                                        }
                                }
                                status_code_rows.close();
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                };
                /**
                 *  override nav_right_btn_click_event  function of parent class: transaction.js
                 */                    
                self.nav_right_btn_click_event = function(e){
                        try{
                                var add_job_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'job/edit/job_index_view.js'),
                                        type:win.type,
                                        job_id:0,
                                        job_reference_number:0,
                                        job_status_code:0,
                                        action_for_job:'add_job'
                                });
                                Ti.UI.currentTab.open(add_job_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
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
                                        url:self.get_file_path('url','job/edit/job_index_view.js'),
                                        type:_type,
                                        action_for_job:'edit_job',
                                        job_id:self.data[e.index].job_id,
                                        job_reference_number:self.data[e.index].job_reference_number,
                                        job_status_code:self.data[e.index].job_status_code
                                });
                                Ti.UI.currentTab.open(new_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }		
                }; 
                /**
                 *  display list
                 */                    
                self.display = function(){
                        try{                            
                                //get job id array or quote id array by different upload status 
                                var db = Titanium.Database.open(self.get_db_name());                                           
                                var rows = db.execute('SELECT * FROM my_updating_records WHERE upload_status in (3) and company_id=?',_selected_company_id);
                                while(rows.isValidRow()){
                                        if(rows.fieldByName('type') === 'job'){
                                                _job_id_array.push(rows.fieldByName('relation_id')); 
                                        }
                                        if(rows.fieldByName('type') === 'quote'){
                                                _quote_id_array.push(rows.fieldByName('relation_id')); 
                                        }                                               
                                        rows.next();
                                }
                                rows.close();
                                db.close();   
                
//                                db = Titanium.Database.open(self.get_db_name());
//                                rows = db.execute('SELECT * FROM my_updating_records_for_data WHERE company_id=?',_selected_company_id);
//                                while(rows.isValidRow()){
//                                        if(rows.fieldByName('type') === 'job'){
//                                                _job_id_array.push(rows.fieldByName('relation_id')); 
//                                        }
//                                        if(rows.fieldByName('type') === 'quote'){
//                                                _quote_id_array.push(rows.fieldByName('relation_id')); 
//                                        }                                               
//                                        rows.next();
//                                }
//                                rows.close();                
//                                db.close();                           
                                //has been displayed id array
                                self.data = [];
                                self.table_view.setData([]);
                                _query_records_num = 0;
                                _get_job_list_with_assigned_from_is_null();
                                _get_job_list_with_assigned_from_is_not_null();
                                if(_query_records_num > 0){
                                        self.no_result_label.visible = false;
                                }else{
                                        self.no_result_label.visible = true;
                                }
                                self.table_view.setData(self.data,{
                                        animationStyle:Titanium.UI.iPhone.RowAnimationStyle.DOWN
                                });     
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }                        
                };

                //private member
                var _type = (win.type === undefined)?'job':win.type;
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _query_records_num = 0;
                var _status_code_array = [];
                var _job_id_array = [];
                var _quote_id_array = []; 

                /**
                 *  get job or quote list which's assigned from is null
                 */
                function _get_job_list_with_assigned_from_is_null(){
                        try{
                                var sql = '';
                                var temp_where_condition = '';
                                if(_type === 'job'){
                                        if(_job_id_array.length > 0){
                                                temp_where_condition = '(my_'+_type+'.exist_any_changed=1 or my_'+_type+'.changed=1 or (my_'+_type+'.id in ('+_job_id_array.join(',')+')))';
                                        }else{
                                                temp_where_condition = '(my_'+_type+'.exist_any_changed=1 or my_'+_type+'.changed=1)';
                                        }
                                }else{
                                        if(_quote_id_array.length > 0){
                                                temp_where_condition = '(my_'+_type+'.exist_any_changed=1 or (my_'+_type+'.id in ('+_quote_id_array.join(',')+')))';
                                        }else{
                                                temp_where_condition = '(my_'+_type+'.exist_any_changed=1 or my_'+_type+'.changed=1)';
                                        }
                                }
                                var sql_params ={
                                        //is_task:false, //not to set is_task for query all jobs or quotes
                                        is_calendar:false,//in calendar or in filter
                                        is_scheduled:false,//query assigned_from is not null
                                        is_check_changed:false,//check changed field or not
                                        is_check_local_job:true,
                                        is_check_self_job:false,//only check current user's job
                                        order_by:'my_'+_type+'.reference_number desc',
                                        extra_left_join_condition:'',
                                        extra_where_condition:temp_where_condition,
                                        type:_type,
                                        user_id:_selected_user_id,
                                        company_id:_selected_company_id,
                                        job_status_code:-1
                                };
                                sql = self.setup_sql_query_for_display_job_list(sql_params);
                                if(sql != ''){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute(sql);
                                        var b = _query_records_num;
                                        _query_records_num+= rows.getRowCount();
                                        Ti.API.info("rows.getRowCount():"+rows.getRowCount());
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){
                                                        if((rows.fieldByName('assigned_from') === null)||(rows.fieldByName('assigned_from') === '')){
                                                                var status_colour = '';
                                                                var status_name = '';
                                                                var status_description = '';
                                                                for(var i=0,j=_status_code_array.length;i<j;i++){
                                                                        if(_status_code_array[i].code == rows.fieldByName(_type+'_status_code')){
                                                                                status_colour = _status_code_array[i].colour;
                                                                                status_name  = _status_code_array[i].name;
                                                                                status_description = _status_code_array[i].description;
                                                                                break;
                                                                        }
                                                                }                                                  
                                                                Ti.API.info('ra id'+rows.fieldByName('id'));
                                                                var params = {
                                                                        is_header:(b === 0)?true:false,
                                                                        header_text:'Not Scheduled',
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
                                                                        job_status_color:status_colour,
                                                                        job_status_name:status_name,
                                                                        job_status_description:status_description,
                                                                        sub_number:rows.fieldByName('sub_number'),
                                                                        unit_number:rows.fieldByName('unit_number'),
                                                                        street_number:rows.fieldByName('street_number'),
                                                                        street:rows.fieldByName('street'),
                                                                        street_type:rows.fieldByName('street_type'),
                                                                        suburb:rows.fieldByName('suburb'),
                                                                        postcode:rows.fieldByName('postcode')
                                                                };                                                          
                                                                self.data.push(self.setup_job_row_for_job_list(params));
                                                                b++;
                                                        }
                                                        rows.next();
                                                }
                                        }
                                        rows.close();
                                        db.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_job_list_with_assigned_from_is_null');
                                return;
                        }
                }
                /**
                 *  get job or quote list which's assigned from is not null
                 */                
                function _get_job_list_with_assigned_from_is_not_null(){
                        try{             
                                var sql = '';
                                var temp_where_condition = '';
                                if(_type === 'job'){
                                        if(_job_id_array.length > 0){
                                                temp_where_condition = '(my_'+_type+'.exist_any_changed=1 or my_'+_type+'.changed=1 or (my_'+_type+'.id in ('+_job_id_array.join(',')+')))';
                                        }else{
                                                temp_where_condition = '(my_'+_type+'.exist_any_changed=1 or my_'+_type+'.changed=1)';
                                        }
                                }else{
                                        if(_quote_id_array.length > 0){
                                                temp_where_condition = '(my_'+_type+'.exist_any_changed=1 or (my_'+_type+'.id in ('+_quote_id_array.join(',')+')))';
                                        }else{
                                                temp_where_condition = '(my_'+_type+'.exist_any_changed=1 or my_'+_type+'.changed=1)';
                                        }
                                }             
                                var sql_params ={
                                        //is_task:false,
                                        is_calendar:false,//in calendar or in filter
                                        is_scheduled:true,//query assigned_from is not null
                                        is_check_changed:false,//check changed field or not
                                        is_check_local_job:true,
                                        is_check_self_job:false,//only check current user's job
                                        order_by:'assigned_from desc',
                                        extra_left_join_condition:'',
                                        extra_where_condition:temp_where_condition,
                                        type:_type,
                                        user_id:_selected_user_id,
                                        company_id:_selected_company_id,
                                        job_status_code:-1
                                };
                                sql = self.setup_sql_query_for_display_job_list(sql_params);
                                if(sql != ''){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute(sql);
                                        var q_row_count = rows.getRowCount();
                                        var b = _query_records_num;
                                        _query_records_num+= rows.getRowCount();


                                        //display the job row
                                        var temp_year = 0;
                                        var temp_month = 0;
                                        var temp_date = 0;
                                        var temp_day = 0;
                                        var temp_hours = 0;
                                        var temp_minutes = 0;
                                        var temp_string = temp_year+'-'+(temp_month+1)+'-'+temp_date;
                                        var temp_big_array = [];//save all job with schedlued from
                                        var temp_sub_array = [];//every day's jobs as a sub array
                                        var temp_sub_header_array = [];
                                        var q=0;
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){
                                                        if((rows.fieldByName('assigned_from') != null)&&(rows.fieldByName('assigned_from') != '')){
                                                                var assigned_user_count = 0;
                                                                if(_query_records_num > 0){
                                                                        var assigned_user_rows = db.execute('SELECT count(*) as count FROM my_'+_type+'_assigned_user WHERE status_code=1 and '+_type+'_id=?',rows.fieldByName('id'));
                                                                        assigned_user_count = assigned_user_rows.fieldByName('count');
                                                                        assigned_user_rows.close();
                                                                }
                                                                var temp_date_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_from'));
                                                                temp_date_value = new Date(temp_date_value*1000);
                                                                temp_year = temp_date_value.getFullYear();
                                                                temp_month = temp_date_value.getMonth()+1;
                                                                temp_date = temp_date_value.getDate();
                                                                temp_day = temp_date_value.getDay();
                                                                temp_hours = temp_date_value.getHours();
                                                                temp_minutes = temp_date_value.getMinutes();
                                                                var status_colour = '';
                                                                var status_name = '';
                                                                var status_description = '';
                                                                for(var i=0,j=_status_code_array.length;i<j;i++){
                                                                        if(_status_code_array[i].code == rows.fieldByName(_type+'_status_code')){
                                                                                status_colour = _status_code_array[i].colour;
                                                                                status_name  = _status_code_array[i].name;
                                                                                status_description = _status_code_array[i].description;
                                                                                break;
                                                                        }
                                                                }                                                                
                                                                if((temp_year+'-'+temp_month+'-'+temp_date) === temp_string){
                                                                }else{
                                                                        temp_string = temp_year+'-'+temp_month+'-'+temp_date;
                                                                        temp_sub_header_array.push(self.day_list[temp_day]+' '+temp_date+'-'+self.month_list[temp_month-1]+'-'+temp_year);

                                                                        if(temp_sub_array.length > 0){
                                                                                temp_sub_array.reverse();
                                                                                temp_big_array.push(temp_sub_array);
                                                                        }
                                                                        temp_sub_array = [];//every day's jobs as a sub array
                                                                }

                                                                var assigned_to_hours = '';
                                                                var assigned_to_minutes = '';
                                                                if((rows.fieldByName('assigned_to') != undefined) && (rows.fieldByName('assigned_to') != null) && (rows.fieldByName('assigned_to') != '')){
                                                                        var assigned_to_temp_date_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_to'));
                                                                        assigned_to_temp_date_value = new Date(assigned_to_temp_date_value*1000);
                                                                        assigned_to_hours = assigned_to_temp_date_value.getHours();
                                                                        assigned_to_minutes = assigned_to_temp_date_value.getMinutes();
                                                                }

                                                                var params = {
                                                                        is_header:false,
                                                                        header_text:'',
                                                                        job_type:_type,
                                                                        job_title:rows.fieldByName('title'),
                                                                        job_id:rows.fieldByName('id'),
                                                                        job_reference_number:rows.fieldByName('reference_number'),
                                                                        job_status_code:rows.fieldByName(_type+'_status_code'),
                                                                        class_name:'show_'+_type+'_row_'+b,
                                                                        assigned_from_hours:temp_hours,
                                                                        assigned_from_minutes:temp_minutes,
                                                                        assigned_to_hours:assigned_to_hours,
                                                                        assigned_to_minutes:assigned_to_minutes,
                                                                        job_status_color:status_colour,
                                                                        job_status_name:status_name,
                                                                        job_status_description:status_description,
                                                                        sub_number:rows.fieldByName('sub_number'),
                                                                        unit_number:rows.fieldByName('unit_number'),
                                                                        street_number:rows.fieldByName('street_number'),
                                                                        street:rows.fieldByName('street'),
                                                                        street_type:rows.fieldByName('street_type'),
                                                                        suburb:rows.fieldByName('suburb'),
                                                                        postcode:rows.fieldByName('postcode'),
                                                                        assigned_user_count:assigned_user_count
                                                                };                                                                                                                       
                                                                temp_sub_array.push(self.setup_job_row_for_job_list(params));
                                                                b++;
                                                        }
                                                        if(q+1 === q_row_count){
                                                                temp_sub_array.reverse();
                                                                temp_big_array.push(temp_sub_array);
                                                        }
                                                        q++;
                                                        rows.next();
                                                }
                                        }
                                        rows.close();
                                        db.close();
                                        //load data into array by new order
                                        for(i=0,j=temp_big_array.length;i<j;i++){
                                                for(var m=0,n=temp_big_array[i].length;m<n;m++){
                                                        if(m === 0){
                                                                temp_big_array[i][m].header = temp_sub_header_array[i];
                                                        }
                                                        self.data.push(temp_big_array[i][m]);
                                                }
                                        }
                                        for(i=0,j=self.data.length;i<j;i++){
                                                if(i%2 === 0){
                                                        self.data[i].backgroundColor = self.job_list_row_background_color;
                                                }else{
                                                        self.data[i].backgroundColor = '#fff';
                                                }
                                        }
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_job_list_with_assigned_from_is_not_null');
                                return;
                        }
                }          
        }

        win.addEventListener('focus',function(){
                try{                        
                        if(local_job_list_page_obj === null){
                                Ti.App.Properties.setBool('refresh_list',false);
                                var F = function(){};
                                F.prototype = transaction_page.prototype;
                                local_job_list_page.prototype = new F();
                                local_job_list_page.prototype.constructor = local_job_list_page;
                                local_job_list_page_obj = new local_job_list_page();            
                                local_job_list_page_obj.init();
                        }
                        local_job_list_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        local_job_list_page_obj.close_window();
                        local_job_list_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());

