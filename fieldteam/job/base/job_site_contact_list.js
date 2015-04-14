//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_site_contact_list_page_obj = null;

        function job_site_contact_list_page(){
                var self = this;
                var window_source = 'job_site_contact_list_page';
                win.title = 'Site Contact List';

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
                                        _init_bottom_tool_bar();
                                }else{
                                        self.init_navigation_bar('','Main,Back');     
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
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                  
                self.nav_right_btn_click_event = function(e){
                        try{
                                var new_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','job/base/job_site_contact.js'),
                                        type:_type,
                                        job_id:_selected_job_id,
                                        job_reference_number:_selected_job_reference_number,
                                        action_for_site_contact:'add_job_site_contact',
                                        job_site_contact_id:0
                                });
                                Ti.UI.currentTab.open(new_win,{
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
                                                url:self.get_file_path('url', 'job/edit/job_site_contact_view.js'),
                                                type:_type,
                                                job_id:_selected_job_id,
                                                job_reference_number:_selected_job_reference_number,
                                                action_for_site_contact:'view_job_site_contact',
                                                site_contact_id:e.row.object_id
                                        });
                                        Ti.UI.currentTab.open(new_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                }else{
                                        if(!_is_task){
                                        new_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url', 'job/base/job_site_contact.js'),
                                                type:_type,
                                                job_id:_selected_job_id,
                                                job_reference_number:_selected_job_reference_number,
                                                action_for_site_contact:'edit_job_site_contact',
                                                job_site_contact_id:e.row.object_id                        
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
                 *  display site contact list
                 */
                self.display = function(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);

                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_'+_type+'_site_contact WHERE '+_type+'_id=? and status_code=1',_selected_job_id);
                                var i=0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'site_contact',
                                                        className:'site_contact_'+i,
                                                        height:'auto',
                                                        hasChild:(_is_task)?false:true,
                                                        object_id:rows.fieldByName('id')
                                                });                                       
                                                if(rows.fieldByName('is_primary_contact')){
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
                                                                text:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
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
                                                                text:'[Primary Contact]',
                                                                height:20,
                                                                font:{
                                                                        fontSize:self.small_font_size
                                                                }
                                                        });
                                                        row.add(position_label);
                                                }else{
                                                        edit_btn = Ti.UI.createButton({
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
                                                                width:_header_view_button_width-5,
                                                                height:_header_view_button_height
                                                        });
                                                        row.add(edit_btn);                                                 
                                                        title_label = Ti.UI.createLabel({
                                                                left:10+_header_view_button_width,
                                                                width:self.screen_width-100,
                                                                text:rows.fieldByName('first_name')+' '+rows.fieldByName('last_name'),
                                                                height:20,
                                                                font:{
                                                                        fontSize:self.normal_font_size,
                                                                        fontWeight:self.font_weight
                                                                }
                                                        });
                                                        row.add(title_label);
                                                }

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
                var _header_view_button_width = 60;
                var _header_view_button_height = 26;
                var _header_view_font_size = 16;
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
                                        db.execute('DELETE FROM my_'+_type+'_site_contact WHERE id=?',job_assigned_user_id);
                                }else{
                                        db.execute('UPDATE my_'+_type+'_site_contact SET changed=?,status_code=?  WHERE id='+job_assigned_user_id,
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
                        if(job_site_contact_list_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_site_contact_list_page.prototype = new F();
                                job_site_contact_list_page.prototype.constructor = job_site_contact_list_page;
                                job_site_contact_list_page_obj = new job_site_contact_list_page();
                                job_site_contact_list_page_obj.init();
                        }else{
                                job_site_contact_list_page_obj.display();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_site_contact_list_page_obj.close_window();
                        job_site_contact_list_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });    
}());


