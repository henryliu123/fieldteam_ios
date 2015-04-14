//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_job_history_page_obj = null;

        function job_base_job_history_page(){
                var self = this;
                var window_source = 'job_base_job_history_page';
                win.title = self.ucfirst(win.type)+' History Record';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                 
                self.init = function(){
                        try{         
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('','Main,Back');                                
                                self.init_table_view();//inherite init_table_view function from parent class
                                self.init_vars();                                                              
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
                                self.display_indicator('Loading Recipient ...',false);
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
                                var contact_type_code_rows = db.execute('SELECT * FROM my_contact_type_code');
                                if(contact_type_code_rows != null){
                                        while(contact_type_code_rows.isValidRow()){
                                                temp_var = {
                                                        code:contact_type_code_rows.fieldByName('code'),
                                                        name:contact_type_code_rows.fieldByName('name')
                                                };
                                                _contact_type_code_array.push(temp_var);
                                                contact_type_code_rows.next();
                                        }
                                        contact_type_code_rows.close();                                        
                                }
                                
                                //check all recipients
                                var row = null;
                                var rows = db.execute('select * from my_'+_type+'_contact_history_recipient where status_code=1 and '+_type+'_contact_history_id=? order by id desc',_selected_job_contact_history_id);
                                while(rows.isValidRow()){
                                        _get_all_recipients(db,rows.fieldByName('model'),rows.fieldByName('pk_id'),rows.fieldByName('contact'));                                        
                                        rows.next();
                                }
                                db.close();
                                
                                if((_need_to_download_user_id_array.length)>0 || (_need_to_download_client_id_array.length)>0 || (_need_to_download_client_contact_id_array.length)>0 || (_need_to_download_site_contact_id_array.length)>0){
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
                                                                if(self.return_to_login_page_if_user_security_session_changed(this.responseText)){
                                                                        return;
                                                                }                                                                 
                                                                if(self.display_app_version_incompatiable(this.responseText)){
                                                                        return;
                                                                }         
                                                                if(this.responseText != '[]'){
                                                                        if(_need_to_download_user_id_array.length>0){
                                                                                self.update_selected_tables(null,'ManagerUser',JSON.parse(this.responseText));
                                                                        }
                                                                        if(_need_to_download_client_id_array.length>0){
                                                                                self.update_selected_tables(null,'Client',JSON.parse(this.responseText));                                                                         
                                                                        }
                                                                        if(_need_to_download_client_contact_id_array.length>0){
                                                                                self.update_selected_tables(null,'ClientContact',JSON.parse(this.responseText));
                                                                        }
                                                                        if(_need_to_download_site_contact_id_array.length>0){
                                                                                if(_type == 'job'){
                                                                                        self.update_selected_tables(null,'JobSiteContact',JSON.parse(this.responseText)); 
                                                                                }else{
                                                                                        self.update_selected_tables(null,'QuoteSiteContact',JSON.parse(this.responseText)); 
                                                                                }                                                                           
                                                                        }
                                                                        var db = Titanium.Database.open(self.get_db_name());
                                                                        for(var i=0,j=_recipient_array.length;i<j;i++){                                                                                
                                                                                if(!_recipient_array[i].is_exist){
                                                                                        switch(_recipient_array[i].model){
                                                                                                case 'user':
                                                                                                        var row = db.execute('select * from my_manager_user WHERE  id=?',_recipient_array[i].recipient_id);
                                                                                                        if(row.isValidRow() && (row.getRowCount() > 0)){
                                                                                                                _recipient_array[i].display_name = row.fieldByName('display_name');
                                                                                                                _recipient_array[i].is_exist = true;
                                                                                                        }
                                                                                                        break;
                                                                                                case 'client':
                                                                                                        row = db.execute('select * from my_client WHERE  id=?',_recipient_array[i].recipient_id);
                                                                                                        if(row.isValidRow() && (row.getRowCount() > 0)){
                                                                                                                _recipient_array[i].display_name = row.fieldByName('client_name');
                                                                                                                _recipient_array[i].is_exist = true;
                                                                                                        }                                                                                                        
                                                                                                        break;
                                                                                                case 'client_contact':
                                                                                                        row = db.execute('select * from my_client_contact WHERE  id=?',_recipient_array[i].recipient_id);
                                                                                                        if(row.isValidRow() && (row.getRowCount() > 0)){
                                                                                                                _recipient_array[i].display_name = row.fieldByName('display_name');
                                                                                                                _recipient_array[i].is_exist = true;
                                                                                                        }                                                                                                        
                                                                                                        break;
                                                                                                case 'site_contact':
                                                                                                        row = db.execute('select * from my_'+_type+'_site_contact WHERE  id=?',_recipient_array[i].recipient_id);
                                                                                                        if(row.isValidRow() && (row.getRowCount() > 0)){
                                                                                                                _recipient_array[i].display_name = row.fieldByName('display_name');
                                                                                                                _recipient_array[i].is_exist = true;
                                                                                                        }                                                                                                        
                                                                                                        break;
                                                                                        }
                                                                                }                                                                                
                                                                        }
                                                                        db.close();
                                                                        setTimeout(function(){
                                                                                self.hide_indicator();
                                                                                _display();                                                                                  
                                                                        },1000);
                                                                }                                                                
                                                        }else{
                                                                self.hide_indicator();
                                                                var params = {
                                                                        message:L('message_failure_download_recipients'),
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - self.init_vars - xhr.onload - 1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);                                                                
                                                                _display();  
                                                                return;
                                                        }
                                                }catch(e){
                                                        self.hide_indicator();
                                                        params = {
                                                                message:L('message_failure_download_recipients'),
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - self.init_vars - xhr.onload - 2',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                         
                                                        _display();  
                                                        return;
                                                }
                                        };
                                        xhr.onerror = function(e){
                                                self.hide_indicator();
                                                var params = {
                                                        message:L('message_failure_download_recipients'),
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - self.init_vars - xhr.onerror',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);  
                                                _display();  
                                                return;
                                        };
                                        xhr.setTimeout(self.default_time_out);
                                        xhr.open('POST',self.get_host_url()+'update',false);
                                        xhr.send({
                                                'type':'download_contact_history_recipient',
                                                'hash':_selected_user_id,            
                                                'job_type':_type,
                                                'company_id':_selected_company_id,
                                                'user_id_string':((_need_to_download_user_id_array.length)>0?(_need_to_download_user_id_array.join(',')):null),
                                                'client_id_string':((_need_to_download_client_id_array.length)>0?(_need_to_download_client_id_array.join(',')):null),
                                                'client_contact_id_string':((_need_to_download_client_contact_id_array.length)>0?(_need_to_download_client_contact_id_array.join(',')):null),
                                                'site_contact_id_string':((_need_to_download_site_contact_id_array.length)>0?(_need_to_download_site_contact_id_array.join(',')):null),
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()
                                        });    
                                }else{
                                        self.hide_indicator();
                                        _display();  
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                };                       
                /**
                 *  override table_view_click function of parent class: fieldteam.js
                 */                      
                self.table_view_click_event = function(e){
                        try{
                                if(e.row.filter_class == 'job_contact_history_recipient'){
                                        switch(e.row.job_contact_history_recipient_model){
                                                case 'user':
                                                        var new_win = Ti.UI.createWindow({
                                                                url:self.get_file_path('url','job/edit/job_user_view.js',''),
                                                                type:_type,
                                                                job_id:e.row.job_id,
                                                                action_for_user:'view_job_user',
                                                                manager_user_id:e.row.job_contact_history_recipient_id
                                                        });
                                                        Ti.UI.currentTab.open(new_win,{
                                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                        });                                                      
                                                        break;
                                                case 'client':
                                                        new_win = Ti.UI.createWindow({
                                                                url:self.get_file_path('url', 'job/edit/job_client_view.js'),
                                                                type:_type,
                                                                job_id:e.row.job_id,
                                                                client_id:e.row.job_contact_history_recipient_id,
                                                                action_for_client:'view_client',
                                                                parent_win:win
                                                        });
                                                        Titanium.UI.currentTab.open(new_win,{
                                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                        });                                                         
                                                        break;
                                                case 'client_contact':
                                                        new_win = Ti.UI.createWindow({
                                                                url:self.get_file_path('url','job/edit/job_client_contact_view.js'),
                                                                type:_type,
                                                                client_contact_id:e.row.job_contact_history_recipient_id,
                                                                job_id:e.row.job_id,
                                                                action_for_client_contact:'view_job_client_contact',
                                                                source:'job_index_view'
                                                        });
                                                        Ti.UI.currentTab.open(new_win,{
                                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                        });                                                        
                                                        break;
                                                case 'site_contact':
                                                        new_win = Ti.UI.createWindow({
                                                                url:self.get_file_path('url', 'job/edit/job_site_contact_view.js'),
                                                                type:_type,
                                                                job_id:e.row.job_id,
                                                                action_for_site_contact:'view_job_site_contact',
                                                                site_contact_id:e.row.job_contact_history_recipient_id
                                                        });
                                                        Ti.UI.currentTab.open(new_win,{
                                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                        });                                                       
                                                        break;
                                        }                                                
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                          
                };
                
                //private member
                var _type = win.type;
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = win.company_id;
                var _selected_job_contact_history_id = win.job_contact_history_id;
                var _contact_type_code_array = [];
                var _manager_user_array = [];
                var _recipient_array = [];
                var _need_to_download_user_id_array = [];
                var _need_to_download_client_id_array = [];
                var _need_to_download_client_contact_id_array = [];
                var _need_to_download_site_contact_id_array = [];                
                //private method
                /**
                 *  display history 
                 */
                function _display(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_'+_type+'_contact_history WHERE status_code=1 and id=? ORDER BY id desc',_selected_job_contact_history_id);
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var new_text = '';
                                                var temp_flag = 0;
                                                if(_contact_type_code_array.length > 0){
                                                        for(var i=0,j=_contact_type_code_array.length;i<j;i++){
                                                                if(_contact_type_code_array[i].code == rows.fieldByName('contact_type_code')){
                                                                        temp_flag = 1;
                                                                        new_text+='Type : '+_contact_type_code_array[i].name+'\n';
                                                                        break;
                                                                }
                                                        }
                                                        if(!temp_flag){
                                                                new_text+='Type : Unknown'+'\n';
                                                        }
                                                }else{
                                                        new_text+='Type : Unknown'+'\n';
                                                }  
                                                
                                                temp_flag = 0;
                                                if(_manager_user_array.length > 0){
                                                        for(i=0,j=_manager_user_array.length;i<j;i++){
                                                                if(_manager_user_array[i].id == rows.fieldByName('manager_user_id')){
                                                                        temp_flag = 1;
                                                                        new_text+='Sender : '+_manager_user_array[i].display_name+'\n';
                                                                        break;
                                                                }
                                                        }
                                                        if(!temp_flag){
                                                                new_text+='Sender : Unknown'+'\n';
                                                        }
                                                }else{
                                                        new_text+='Sender : Unknown'+'\n';
                                                }                                                  

                                                new_text+='Time : '+(((rows.fieldByName('contacted') === undefined) || (rows.fieldByName('contacted') === null))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(rows.fieldByName('contacted'))))+'\n';
                                                if(rows.fieldByName('description') != ''){
                                                        new_text+='Description : '+rows.fieldByName('description')+'\n';
                                                }

                                                var new_row = Ti.UI.createTableViewRow({
                                                        className:'job_contact_history_'+b,
                                                        filter_class:'job_contact_history',
                                                        hasChild:false,
                                                        height:'auto',
                                                        job_id:rows.fieldByName(_type+'_id'),
                                                        job_contact_history_id:rows.fieldByName('id'),
                                                        job_contact_type_code:rows.fieldByName('contact_type_code')
                                                });
                                                new_row.add(Ti.UI.createLabel({
                                                        text:new_text,
                                                        textAlign:'left',
                                                        height:'auto',
                                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                                        left:10,
                                                        top:10,
                                                        bottom:10
                                                }));
                                                self.data.push(new_row);
                                                
                                                //display recipient
                                                if(_recipient_array.length > 0){
                                                        for(i=0,j=_recipient_array.length;i<j;i++){
                                                                if(_recipient_array[i].is_exist){
                                                                        var new_row2 = Ti.UI.createTableViewRow({
                                                                                className:'job_contact_history_recipient'+i,
                                                                                filter_class:'job_contact_history_recipient',
                                                                                hasChild:(_recipient_array[i].model == 'manual')?false:true,
                                                                                height:'auto',
                                                                                job_id:rows.fieldByName(_type+'_id'),
                                                                                job_contact_history_id:_selected_job_contact_history_id,
                                                                                job_contact_type_code:rows.fieldByName('contact_type_code'),
                                                                                job_contact_history_recipient_id:_recipient_array[i].recipient_id,
                                                                                job_contact_history_recipient_model:_recipient_array[i].model
                                                                        });
                                                                        if(i==0){
                                                                                if(_recipient_array.length > 1){
                                                                                        new_row2.header = 'Recipients';
                                                                                }else{
                                                                                        new_row2.header = 'Recipient';
                                                                                }
                                                                        }
                                                                
                                                                        var name_type = Ti.UI.createLabel({
                                                                                text:_recipient_array[i].display_name,
                                                                                textAlign:'left',
                                                                                height:'auto',
                                                                                width:self.screen_width-30,
                                                                                left:10,
                                                                                top:3
                                                                        });
                                                                        new_row2.add(name_type);
                                                                        var type_temp_name = '';
                                                                        switch(_recipient_array[i].model){
                                                                                case 'manual':
                                                                                        type_temp_name = 'Manual'; 
                                                                                        break;
                                                                                case 'user':
                                                                                        type_temp_name = 'Staff'; 
                                                                                        break;
                                                                                case 'client':
                                                                                        type_temp_name = 'Client'; 
                                                                                        break;
                                                                                case 'client_contact':
                                                                                        type_temp_name = 'Client Contact'; 
                                                                                        break;
                                                                                case 'site_contact':
                                                                                        type_temp_name = 'Site Contact'; 
                                                                                        break;
                                                                        }
                                                                        var model_type = Ti.UI.createLabel({
                                                                                text:'[Type:'+type_temp_name+']',
                                                                                textAlign:'left',
                                                                                height:'auto',
                                                                                width:self.screen_width-30,
                                                                                left:10,
                                                                                bottom:3,
                                                                                font:{
                                                                                        fontSize:self.small_font_size
                                                                                }                                                                        
                                                                        });                                                                                                                                
                                                                        new_row2.add(model_type);
                                                                        self.data.push(new_row2); 
                                                                }
                                                        }
                                                }
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                                db.close();
                                self.table_view.setData(self.data);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display');
                                return;
                        }
                }
                /*
                 *  setup recipient array
                 *  if not exist in local database, then set is_exist = false and display_name = unknown.                 
                 */
                function _get_all_recipients(db,model,pk_id,contact){
                        try{
                                switch(model){
                                        case 'manual':
                                                var temp_var = {
                                                        model:model,
                                                        recipient_id:pk_id,
                                                        display_name:contact,
                                                        is_exist:true
                                                };
                                                _recipient_array.push(temp_var);                                        
                                                break;
                                        case 'user'://manager user
                                                var row = db.execute('select * from my_manager_user WHERE  id=?',pk_id); 
                                                if(row.isValidRow() && (row.getRowCount() > 0)){
                                                        var temp_var = {
                                                                model:model,
                                                                recipient_id:pk_id,
                                                                display_name:row.fieldByName('display_name'),
                                                                is_exist:true
                                                        };
                                                        _recipient_array.push(temp_var);
                                                }else{
                                                        temp_var = {
                                                                model:model,
                                                                recipient_id:pk_id,
                                                                display_name:'Unknown',
                                                                is_exist:false
                                                        };
                                                        _recipient_array.push(temp_var);                                                                
                                                        _need_to_download_user_id_array.push(pk_id);
                                                }
                                                break;
                                        case 'client':
                                                row = db.execute('select * from my_client WHERE  id=?',pk_id); 
                                                if(row.isValidRow() && (row.getRowCount() > 0)){
                                                        temp_var = {
                                                                model:model,
                                                                recipient_id:pk_id,
                                                                display_name:row.fieldByName('client_name'),
                                                                is_exist:true
                                                        };
                                                        _recipient_array.push(temp_var);
                                                }else{
                                                        temp_var = {
                                                                model:model,
                                                                recipient_id:pk_id,
                                                                display_name:'Unknown',
                                                                is_exist:false
                                                        };
                                                        _recipient_array.push(temp_var);                                                                 
                                                        _need_to_download_client_id_array.push(pk_id);
                                                }                                                        
                                                break;
                                        case 'client_contact':
                                                row = db.execute('select * from my_client_contact WHERE  id=?',pk_id); 
                                                if(row.isValidRow() && (row.getRowCount() > 0)){
                                                        temp_var = {
                                                                model:model,
                                                                recipient_id:pk_id,
                                                                display_name:row.fieldByName('display_name'),
                                                                is_exist:true
                                                        };
                                                        _recipient_array.push(temp_var);
                                                }else{
                                                        temp_var = {
                                                                model:model,
                                                                recipient_id:pk_id,
                                                                display_name:'Unknown',
                                                                is_exist:false
                                                        };
                                                        _recipient_array.push(temp_var);                                                                 
                                                        _need_to_download_client_contact_id_array.push(pk_id);
                                                }                                                            
                                                break;
                                        case 'site_contact':
                                                row = db.execute('select * from my_'+_type+'_site_contact WHERE  id=?',pk_id); 
                                                if(row.isValidRow() && (row.getRowCount() > 0)){
                                                        temp_var = {
                                                                model:model,
                                                                recipient_id:pk_id,
                                                                display_name:row.fieldByName('display_name'),
                                                                is_exist:true
                                                        };
                                                        _recipient_array.push(temp_var);
                                                }else{
                                                        temp_var = {
                                                                model:model,
                                                                recipient_id:pk_id,
                                                                display_name:'Unknown',
                                                                is_exist:false
                                                        };
                                                        _recipient_array.push(temp_var);                                                                 
                                                        _need_to_download_site_contact_id_array.push(pk_id);
                                                }                                                             
                                                break;
                                }             
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_all_recipients');
                                return;
                        }                        
                }
        }

        win.addEventListener('open',function(){
                try{
                        if(job_base_job_history_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_job_history_page.prototype = new F();
                                job_base_job_history_page.prototype.constructor = job_base_job_history_page;
                                job_base_job_history_page_obj = new job_base_job_history_page();
                                job_base_job_history_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

        win.addEventListener('close',function(){
                try{
                        job_base_job_history_page_obj.close_window();
                        job_base_job_history_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());


