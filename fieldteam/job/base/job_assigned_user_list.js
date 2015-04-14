//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_assigned_user_list_page_obj = null;

        function job_assigned_user_list_page(){
                var self = this;
                var window_source = 'job_assigned_user_list_page';
                win.title = 'Assigned User List';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                  
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                if(!_is_task){
                                        self.init_navigation_bar('Add','Main,Back');     
                                }else{
                                        self.init_navigation_bar('','Main,Back');     
                                }
                                self.init_vars();
                                if(!_is_task){
                                        _init_bottom_tool_bar();
                                }
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                if(!_is_task){
                                        self.table_view.bottom = self.default_table_view_row_height;
                                }
                                //call init_no_result_label function of parent class: fieldteam.js
                                self.init_no_result_label();                                
                                self.display();
                                _cancel_button = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.CANCEL
                                });
                                _cancel_button.addEventListener('click', function(){
                                        win.setRightNavButton(self.nav_right_btn);
                                        self.table_view.editing = false;
                                        self.bottom_tool_bar.visible = true;
                                }); 
                                self.table_view.addEventListener('delete',function(e){
                                        _event_for_delete_btn(e);
                                });                                   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 *  override init_vars function of parent class: fieldteam.js
                 */                   
                self.init_vars = function(){
                        try{
                                var temp_var = {};
                                var db = Titanium.Database.open(self.get_db_name());
                                var user_row = db.execute('SELECT * FROM my_manager_user WHERE company_id=?',_selected_company_id);
                                if(user_row != null){
                                        while(user_row.isValidRow()){
                                                temp_var = {
                                                        id:user_row.fieldByName('id'),
                                                        display_name:user_row.fieldByName('display_name')
                                                };
                                                _manager_user_array.push(temp_var);
                                                user_row.next();
                                        }
                                        user_row.close();
                                }
                                var usercode_row = db.execute('SELECT * FROM my_job_assigned_user_code');
                                if(usercode_row != null){
                                        while(usercode_row.isValidRow()){
                                                temp_var = {
                                                        code:usercode_row.fieldByName('code'),
                                                        name:usercode_row.fieldByName('name')
                                                };
                                                _assigned_user_code_array.push(temp_var);
                                                usercode_row.next();
                                        }
                                        usercode_row.close();                                        
                                }
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                  
                self.nav_right_btn_click_event = function(e){
                        try{
                                var user_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','job/base/job_assigned_user.js'),
                                        type:_type,
                                        job_id:_selected_job_id,
                                        manager_user_id:0,
                                        job_assigned_user_id:0,
                                        job_assigned_user_code:0,
                                        assigned_from:null,
                                        assigned_to:null,
                                        action_for_assigned_user:'add_job_assigned_user'
                                });
                                Titanium.UI.currentTab.open(user_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }
                };              
                /**
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */                  
                self.table_view_click_event = function(e){
                        try{
                                if(e.source.name === 'view_btn'){
                                        var new_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url', 'job/edit/job_user_view.js'),
                                                type:_type,
                                                job_id:_selected_job_id,
                                                job_reference_number:_selected_job_reference_number,
                                                action_for_user:'view_job_user',
                                                manager_user_id:e.row.manager_user_id,
                                                job_assigned_user_id:e.row.object_id,
                                                job_assigned_user_code:e.row.job_assigned_user_code,
                                                assigned_from:e.row.assigned_from,
                                                assigned_to:e.row.assigned_to
                                        });
                                        Ti.UI.currentTab.open(new_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });                                
                                }else{
                                        if(!_is_task){
                                                new_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url', 'job/base/job_assigned_user.js'),
                                                        type:_type,
                                                        job_id:_selected_job_id,
                                                        job_reference_number:_selected_job_reference_number,
                                                        manager_user_id:e.row.manager_user_id,
                                                        job_assigned_user_id:e.row.object_id,
                                                        job_assigned_user_code:e.row.job_assigned_user_code,
                                                        assigned_from:e.row.assigned_from,
                                                        assigned_to:e.row.assigned_to,
                                                        action_for_assigned_user:'edit_job_assigned_user'
                                                });
                                                Ti.UI.currentTab.open(new_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });   
                                        }
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }
                };
                /**
                 *  display assigned user list
                 */
                self.display = function(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);

                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_'+_type+'_assigned_user WHERE '+_type+'_id=? and status_code=1',_selected_job_id);
                                var i=0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var user_name = '';
                                                var user_assigned_code_name = '';
                                                for(var m=0,n=_manager_user_array.length;m<n;m++){
                                                        if(_manager_user_array[m].id == rows.fieldByName('manager_user_id')){
                                                                user_name = _manager_user_array[m].display_name;
                                                                break;
                                                        }
                                                }
                                                for(m=0,n=_assigned_user_code_array.length;m<n;m++){
                                                        if(_assigned_user_code_array[m].code == rows.fieldByName('job_assigned_user_code')){
                                                                user_assigned_code_name = _assigned_user_code_array[m].name;
                                                                break;
                                                        }
                                                }                                                
                                                
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'manager_user',
                                                        className:'manager_user_'+i,
                                                        height:'auto',
                                                        hasChild:(_is_task)?false:true,
                                                        object_id:rows.fieldByName('id'),
                                                        manager_user_id:rows.fieldByName('manager_user_id'),
                                                        job_assigned_user_code:rows.fieldByName('job_assigned_user_code'),
                                                        assigned_from:rows.fieldByName('assigned_from'),
                                                        assigned_to:rows.fieldByName('assigned_to')
                                                });
                                                var edit_btn = Ti.UI.createButton({
                                                        name:'view_btn',
                                                        backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                        color:'#fff',
                                                        font:{
                                                                fontSize:_header_view_font_size-2,
                                                                fontWeight:'bold'
                                                        },
                                                        title:'View',
                                                        textAlign:'center',
                                                        style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
                                                        left:10,
                                                        top:5,
                                                        width:_header_view_button_width-5,
                                                        height:_header_view_button_height
                                                });
                                                row.add(edit_btn);                                
                                                var title_label = Ti.UI.createLabel({
                                                        top:5,
                                                        left:10+_header_view_button_width,
                                                        width:self.screen_width-100,
                                                        text:user_name,
                                                        height:20,
                                                        font:{
                                                                fontSize:self.normal_font_size,
                                                                fontWeight:self.font_weight
                                                        }
                                                });
                                                row.add(title_label);
                                                var position_label = Ti.UI.createLabel({
                                                        top:25+5,
                                                        left:10,
                                                        width:self.screen_width-100,
                                                        text:'['+user_assigned_code_name+']',
                                                        height:20,
                                                        font:{
                                                                fontSize:self.small_font_size
                                                        }
                                                });
                                                row.add(position_label);
                                                var assigned_from_label = Ti.UI.createLabel({
                                                        top:45+5,
                                                        left:10,
                                                        width:self.screen_width-100,
                                                        text:'From : '+(((rows.fieldByName('assigned_from') === null)||(rows.fieldByName('assigned_from') === ''))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(rows.fieldByName('assigned_from')))),
                                                        height:20,
                                                        font:{
                                                                fontSize:self.small_font_size
                                                        }
                                                });
                                                row.add(assigned_from_label);
                                                var assigned_to_label = Ti.UI.createLabel({
                                                        top:65+5,
                                                        left:10,
                                                        width:self.screen_width-100,
                                                        text:'To     : '+(((rows.fieldByName('assigned_to') === null)||(rows.fieldByName('assigned_to') === ''))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(rows.fieldByName('assigned_to')))),
                                                        height:20,
                                                        font:{
                                                                fontSize:self.small_font_size
                                                        }
                                                });
                                                row.add(assigned_to_label);

                                                self.data.push(row);
                                                i++;
                                                rows.next();
                                        }         
                                }
                                rows.close();
                                db.close();
                                self.table_view.setData(self.data);
                                if(self.data.length > 0){
                                        self.no_result_label.visible = false;
                                }else{
                                        self.no_result_label.visible = true;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }
                };


                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _header_view_button_width = 60;
                var _header_view_button_height = 26;
                var _header_view_font_size = 16;
                var _manager_user_array = [];
                var _assigned_user_code_array = [];
                var _cancel_button = null;
                var _is_task = (win.is_task == undefined)?false:win.is_task;
                
                function _init_bottom_tool_bar(){
                        try{
                                var flexSpace = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
                                });                                
                                //add action button
                                self.trash_button = Ti.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.TRASH 
                                });
                                                                
                                self.bottom_tool_bar = Ti.UI.iOS.createToolbar({
                                        items:[flexSpace,self.trash_button,flexSpace],
                                        bottom:0,
                                        borderColor:self.tool_bar_color_in_ios_7,
                                        borderWidth:1,
                                        zIndex:100
                                });
                                win.add(self.bottom_tool_bar);

                                self.trash_button.addEventListener('click',function(e){
                                        win.setRightNavButton(_cancel_button);
                                        self.table_view.editing = true;
                                        self.bottom_tool_bar.visible = false;
                                        self.table_view.bottom = 0;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_bottom_tool_bar');
                                return;
                        }
                }        
                /**
                 *  delete notes items
                 */                   
                function _event_for_delete_btn(e){
                        try{
                                var job_assigned_user_id = e.row.object_id;
                                var db = Titanium.Database.open(self.get_db_name());
                                if(job_assigned_user_id > 1000000000){
                                        db.execute('DELETE FROM my_'+_type+'_assigned_user WHERE id=?',job_assigned_user_id);
                                }else{
                                        db.execute('UPDATE my_'+_type+'_assigned_user SET changed=?,status_code=?  WHERE id='+job_assigned_user_id,
                                                1,2
                                                );
                                }
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_delete_btn');
                                return;
                        }                        
                }    
        }

        win.addEventListener('focus',function(){
                try{
                        if(job_assigned_user_list_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_assigned_user_list_page.prototype = new F();
                                job_assigned_user_list_page.prototype.constructor = job_assigned_user_list_page;
                                job_assigned_user_list_page_obj = new job_assigned_user_list_page();
                                job_assigned_user_list_page_obj.init();
                        }else{
                                job_assigned_user_list_page_obj.display();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_assigned_user_list_page_obj.close_window();
                        job_assigned_user_list_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });    
}());


