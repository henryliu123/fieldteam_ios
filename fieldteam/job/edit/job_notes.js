//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_edit_job_note_page_obj = null;

        function job_edit_job_note_page(){
                var self = this;
                var window_source = 'job_edit_job_note_page';
                win.title = 'Notes';

                //public method
                /**
                 *  override init  function of parent class: fieldteam.js
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
                 *  override init_vars  function of parent class: fieldteam.js
                 */                    
                self.init_vars = function(){
                        try{
                                var temp_var = {};
                                var db = Titanium.Database.open(self.get_db_name());
                                var row = db.execute('SELECT * FROM my_'+_type+'_note_type_code');
                                if(row != null){
                                        while(row.isValidRow()){
                                                temp_var = {
                                                        code:row.fieldByName('code'),
                                                        name:row.fieldByName('name')
                                                };
                                                _note_type_code_array.push(temp_var);
                                                row.next();
                                        }
                                        row.close();
                                }
                                
                                
                                var rows = db.execute('SELECT * FROM my_'+_type+'_note WHERE status_code=1 and '+_type+'_id=? and '+_type+'_note_type_code!=2 ORDER BY id desc',_selected_job_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var new_text = '';
                                                var temp_flag = 0;
                                                if(_note_type_code_array.length > 0){
                                                        for(var i=0,j=_note_type_code_array.length;i<j;i++){
                                                                if(_note_type_code_array[i].code == rows.fieldByName(_type+'_note_type_code')){
                                                                        temp_flag = 1;
                                                                        new_text+='Type : '+_note_type_code_array[i].name+'\n';
                                                                        break;
                                                                }
                                                        }
                                                        if(!temp_flag){
                                                                new_text+='Type : Unknown'+'\n';
                                                        }
                                                }else{
                                                        new_text+='Type : Unknown'+'\n';
                                                }                                                 
                                                new_text+='Description : '+rows.fieldByName('description')+'\n';
                                                var new_row = Ti.UI.createTableViewRow({
                                                        className:'data_row_'+b,
                                                        filter_class:'job_note',
                                                        hasChild:(_is_task)?false:true,
                                                        height:'auto',
                                                        job_id:rows.fieldByName(_type+'_id'),
                                                        job_note_id:rows.fieldByName('id'),
                                                        job_note_type_code:rows.fieldByName(_type+'_note_type_code')
                                                });
                                                new_row.add(Ti.UI.createLabel({
                                                        text:new_text,
                                                        textAlign:'left',
                                                        height:'auto',
                                                        width:'auto',
                                                        left:10,
                                                        top:10,
                                                        bottom:10
                                                }));
                                                self.data.push(new_row);
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                                db.close();                                                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                };
                /**
                 *  override table_view_click_event  function of parent class: fieldteam.js
                 */                    
                self.table_view_click_event = function(e){
                        try{
                                if(!_is_task){
                                        var note_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url','job/base/job_note.js'),
                                                type:_type,
                                                job_id:e.row.job_id,
                                                job_note_id:e.row.job_note_id,
                                                job_note_type:e.row.job_note_type,
                                                action_for_note:'edit_job_note'
                                        });
                                        Titanium.UI.currentTab.open(note_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                          
                };
                /**
                 *  override nav_right_btn_click_event  function of parent class: fieldteam.js
                 */                    
                self.nav_right_btn_click_event = function(e){
                        try{
                                var note_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','job/base/job_note.js'),
                                        type:_type,
                                        job_id:_selected_job_id,
                                        job_note_id:0,
                                        job_note_type:0,
                                        action_for_note:'add_job_note'
                                });
                                Titanium.UI.currentTab.open(note_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                                     

                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                        
                };                   
                /**
                 *  display result list
                 */                    
                self.display = function(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);
                                self.init_vars();  
                                if(self.data.length > 0){
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
                
                //public member
                //self.action_for_job = win.action_for_job;
                var _type = win.type;
                var _selected_job_id = win.job_id;   
                var _is_task = (win.is_task == undefined)?false:win.is_task;
                var _note_type_code_array = [];
                var _cancel_button = null;
                
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
                                var job_note_id = e.row.job_note_id;
                                var db = Titanium.Database.open(self.get_db_name());
                                if(job_note_id > 1000000000){
                                        db.execute('DELETE FROM my_'+_type+'_note WHERE id=?',job_note_id);
                                }else{
                                        db.execute('UPDATE my_'+_type+'_note SET changed=?,status_code=?  WHERE id='+job_note_id,
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
                        if(job_edit_job_note_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_edit_job_note_page.prototype = new F();
                                job_edit_job_note_page.prototype.constructor = job_edit_job_note_page;
                                job_edit_job_note_page_obj = new job_edit_job_note_page();
                                job_edit_job_note_page_obj.init();
                        }
                        job_edit_job_note_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_edit_job_note_page_obj.close_window();
                        job_edit_job_note_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });    
}());


