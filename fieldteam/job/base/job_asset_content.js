/**
 *  Description: asset editor
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
    
        var job_base_asset_content_page_obj = null;
    
        function job_base_asset_content_page(){
                var self = this;
                var window_source = 'job_base_asset_content_page';
                win.title = 'Edit '+win.asset_type_name;

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                  
                self.init = function(){
                        try{         
                                self.init_auto_release_pool(win);
                                self.data = [];                                
                                self.init_vars();  
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Done','Main,Back');
                                _init_name_field();
                                _init_description_field();
                                _init_delete_btn();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
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
                                if(_selected_job_asset_id > 0){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_'+_type+'_asset WHERE id=?',_selected_job_asset_id);
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                _asset_name = rows.fieldByName('name');
                                                _asset_description = rows.fieldByName('description');
                                        }
                                        rows.close();
                                        db.close();
                                }                                
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
                                _save(e);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return; 
                        }                           
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                        
                self.nav_left_btn_click_event = function(e){
                        try{
                                if(_check_if_exist_change()){
                                        var option_dialog = Ti.UI.createOptionDialog({
                                                options:(self.is_ipad())?['YES','NO','Cancel','']:['YES','NO','Cancel'],
                                                buttonNames:['Cancel'],
                                                destructive:0,
                                                cancel:2,
                                                title:L('message_save_changes')
                                        });
                                        option_dialog.show();
                                        option_dialog.addEventListener('click',function(evt){
                                                switch(evt.index){
                                                        case 0:
                                                                self.nav_right_btn_click_event(e);
                                                                break;
                                                        case 1:
                                                                if(e.index == self.default_main_menu_button_index){//menu menu
                                                                        self.close_all_window_and_return_to_menu(); 
                                                                }else{                                                                
                                                                        win.close();
                                                                }
                                                                break;
                                                        case 2://cancel
                                                                self.nav_left_btn.index = -1;
                                                                break;                                                                     
                                                }
                                        });                                                                                
                                }else{
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{                                                                
                                                win.close();
                                        }
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_left_btn_click_event');
                                return;
                        }
                };                

                //private member
                var _type = win.type;
                var _selected_job_asset_id = win.asset_id;
                var _asset_type_name = win.asset_type_name;//picture,
                var _parent_win = win.parent_win;
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _asset_name = '';
                var _asset_description = '';
                //private method
                
                /**
                 *  init name field
                 */
                function _init_name_field(){
                        try{
                                var is_required_field = true;                                
                                var assetNameField = Ti.UI.createTableViewRow({
                                        className:'set_asset_name',
                                        filter_class:'set_asset_name',
                                        win_title:'Name',
                                        win_label:'Please enter '+_asset_type_name.toLowerCase()+' name',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter name.',//for check value                                  
                                        height:((_asset_name === '')||(_asset_name === null))?self.default_table_view_row_height:'auto'
                                });
                                var assetNameTitleField = Ti.UI.createLabel({
                                        text:'Name',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                assetNameField.add(assetNameTitleField);                                                         

                                self.assetNameContentField = Ti.UI.createTextField({
                                        right:30,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(assetNameTitleField.text),
                                        textAlign:'right',
                                        value:_asset_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                assetNameField.add(self.assetNameContentField);
                                self.data.push(assetNameField);

                                self.assetNameContentField.addEventListener('change',function(e){
                                        _asset_name = e.value;
                                });                      
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_name_field');
                                return; 
                        }                                
                }
                /**
                 *  init description field
                 */
                function _init_description_field(){
                        try{
                                var is_required_field = true;                                    
                                var assetDescriptionField = Ti.UI.createTableViewRow({
                                        className:'set_asset_description',
                                        filter_class:'set_asset_description',
                                        win_title:'Description',
                                        win_label:'Please enter '+_asset_type_name.toLowerCase()+' description',
                                        hasChild:false,
                                        height:100
                                });
                                var assetDescriptionTitleField = Ti.UI.createLabel({
                                        text:'Description',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10,
                                        top:10,
                                        height:30
                                });
                                assetDescriptionField.add(assetDescriptionTitleField);

                                self.assetDescriptionContentField = Ti.UI.createTextArea({
                                        width:self.set_a_field_width_in_table_view_row(assetDescriptionTitleField.text),
                                        height:90,
                                        textAlign:'right',
                                        right:30,
                                        value:_asset_description,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                if(self.is_ios_7_plus()){
                                        self.assetDescriptionContentField.borderWidth=1;
                                        self.assetDescriptionContentField.borderColor= '#ccc';
                                        self.assetDescriptionContentField.borderRadius= 5;
                                }                                   
                                assetDescriptionField.add(self.assetDescriptionContentField);

                                self.assetDescriptionRequiredTextLabel = Ti.UI.createLabel({
                                        top:10,
                                        right:30,
                                        height:30,
                                        width:self.set_a_field_width_in_table_view_row(assetDescriptionTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                assetDescriptionField.add(self.assetDescriptionRequiredTextLabel);
                                self.data.push(assetDescriptionField);
                                if((_asset_description === '')||(_asset_description === null)){
                                }else{
                                        self.assetDescriptionRequiredTextLabel.visible = false;
                                }
                                self.assetDescriptionContentField.addEventListener('change',function(e){
                                        _asset_description = e.value;
                                        if(e.value === ''){
                                                self.assetDescriptionRequiredTextLabel.visible = true;
                                        }else{
                                                self.assetDescriptionRequiredTextLabel.visible = false;
                                        }
                                });
                                self.assetDescriptionContentField.addEventListener('focus',function(e){
                                        self.assetDescriptionRequiredTextLabel.visible = false;
                                });
                                self.assetDescriptionContentField.addEventListener('blur',function(e){
                                        if(e.value === ''){
                                                self.assetDescriptionRequiredTextLabel.visible = true;
                                        }
                                });
                                self.assetDescriptionContentField.addEventListener('click',function(e){
                                        self.assetDescriptionRequiredTextLabel.visible = false;
                                });
                                self.assetDescriptionRequiredTextLabel.addEventListener('click',function(e){
                                        self.assetDescriptionRequiredTextLabel.visible = false;
                                        self.assetDescriptionContentField.focus();
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_description_field');
                                return; 
                        }                                
                }
                /**
                 *  init delete button
                 */
                function _init_delete_btn(){
                        try{
                                var deleteButtonField = Ti.UI.createTableViewRow({
                                        className:'set_delete_button',
                                        filter_class:'set_delete_button',
                                        header:''
                                });
                                self.deleteButton = Ti.UI.createButton({
                                        title:'Delete',
                                        backgroundImage:self.get_file_path('image','BUTT_red_off.png') ,
                                        textAlign:'center',
                                        height:self.default_table_view_row_height,
                                        width:(self.is_ipad())?self.screen_width-self.ipad_button_reduce_length_in_tableview:self.screen_width-self.iphone_button_reduce_length_in_tableview
                                });
                                deleteButtonField.add(self.deleteButton);
                                self.data.push(deleteButtonField);   
                                self.deleteButton.addEventListener('click',function(){
                                        var option_dialog = Ti.UI.createOptionDialog({
                                                options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                                buttonNames:['Cancel'],
                                                destructive:0,
                                                cancel:1,
                                                title:L('message_delete_file_in_job_asset_content')
                                        });
                                        option_dialog.show();
                                        option_dialog.addEventListener('click',function(e){
                                                if(e.index === 0){
                                                        var db = Titanium.Database.open(self.get_db_name());
                                                        var temp_local_id = 0;
                                                        var temp_asset_path = '';
                                                        var temp_asset_path_original = '';
                                                        var temp_asset_mime_type = '';
                                                        var temp_row = db.execute('SELECT * FROM my_'+_type+'_asset WHERE id=?',_selected_job_asset_id);
                                                        if(temp_row.isValidRow()){
                                                                temp_local_id = temp_row.fieldByName('local_id');
                                                                temp_asset_path = temp_row.fieldByName('path');
                                                                temp_asset_path_original = temp_row.fieldByName('path_original');
                                                                if(temp_asset_path_original == null || temp_asset_path_original == ''){
                                                                        temp_asset_path_original = temp_asset_path;
                                                                }
                                                                temp_asset_mime_type = temp_row.fieldByName('mime_type');
                                                        }
                                                        temp_row.close();
                                                        if(_selected_job_asset_id > 1000000000){
                                                                db.execute('DELETE FROM my_'+_type+'_asset WHERE id=?',_selected_job_asset_id);
                                                        }else{
                                                                db.execute('UPDATE my_'+_type+'_asset SET changed=?,status_code=?  WHERE id='+_selected_job_asset_id,1,2);
                                                        }
                                                        db.close();
                                                        
                                                        //remove file from phone
                                                        if(temp_asset_path_original != ''){
                                                                var temp_asset_path_array = temp_asset_path_original.split('/');
                                                                var temp_file_name =  temp_asset_path_array[temp_asset_path_array.length-1];
                                                                var temp_file_first_path = '';
                                                                for(var i=0,j=temp_asset_path_array.length-1;i<j;i++){
                                                                        if(i === 0){
                                                                                temp_file_first_path = temp_asset_path_array[0];
                                                                        }else{
                                                                                temp_file_first_path += '/'+temp_asset_path_array[i];
                                                                        }
                                                                }
                                                                if(temp_file_name != ''){                                                                        
                                                                        //delete original file
                                                                        var file_obj = Titanium.Filesystem.getFile(self.file_directory+temp_file_first_path,temp_file_name);
                                                                        if(file_obj.exists()){
                                                                                file_obj.deleteFile();
                                                                        }        
                                                                        
                                                                        if(temp_asset_mime_type != ''){
                                                                                var temp_asset_mime_type_array = temp_asset_mime_type.split('/');
                                                                                if(temp_asset_mime_type_array[0].toLowerCase() === 'image'){
                                                                                        //delete resize file
                                                                                        file_obj = Titanium.Filesystem.getFile(self.file_directory+temp_file_first_path,'/resized_'+temp_file_name);
                                                                                        if(file_obj.exists()){
                                                                                                file_obj.deleteFile();
                                                                                        }    
                                                                                        //delete thumb file
                                                                                        file_obj = Titanium.Filesystem.getFile(self.file_directory+temp_file_first_path,'/thumb_'+temp_file_name);
                                                                                        if(file_obj.exists()){
                                                                                                file_obj.deleteFile();
                                                                                        }
                                                                                }
                                                                        }
                                                                }
                                                        }
                                                        if(temp_local_id != undefined && temp_local_id != null && temp_local_id != ''){
                                                                db = Titanium.Database.open(self.get_db_name());
                                                                //update my_updating_records table                                                       
                                                                temp_row = db.execute('SELECT * FROM my_updating_records WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                                                if(temp_row.isValidRow()){
                                                                        db.execute('DELETE FROM my_updating_records WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                                                }
                                                                temp_row.close();
                                                                
                                                                temp_row = db.execute('SELECT * FROM my_updating_records_for_data WHERE upload_status !=1 and company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                                                if(temp_row.isValidRow()){
                                                                        db.execute('DELETE FROM my_updating_records_for_data WHERE upload_status !=1 and company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                                                }
                                                                temp_row.close();                                         
                                                                
                                                                temp_row = db.execute('SELECT * FROM my_updating_errors_for_data WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                                                if(temp_row.isValidRow()){
                                                                        db.execute('DELETE FROM my_updating_errors_for_data WHERE company_id=? and type=? and updating_id=?',_selected_company_id,_type,temp_local_id);
                                                                }
                                                                temp_row.close();                                                                    
                                                                db.close();
                                                        }
                                                        _parent_win.close();
                                                        win.close();            
                                                }
                                        });                
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_delete_btn');
                                return; 
                        }                                
                }
                /**
                 *  save result
                 */
                function _save(e){
                        try{
                                if(_check_if_exist_change()){
                                        var error_string = '';
                                        for(var i=0,j=self.data.length;i<j;i++){
                                                if(self.data[i].valueRequired){
                                                        if(self.data[i].valueType === 'text'){
                                                                if(self.data[i].children[self.data[i].valuePosition-1].text === ''){
                                                                        error_string += self.data[i].valuePrompt;
                                                                }
                                                        }else{
                                                                if(self.data[i].children[self.data[i].valuePosition-1].value === ''){
                                                                        error_string += self.data[i].valuePrompt;
                                                                }
                                                        }
                                                }
                                        }
                                        if(_asset_name.length > 50){
                                                error_string += 'Name is too long.(Maximum is 50 characters)\n';
                                        }
                                        if(error_string != ''){
                                                self.show_message(error_string);
                                                return;
                                        }                                        

                                        var db = Titanium.Database.open(self.get_db_name());
                                        db.execute('UPDATE my_'+_type+'_asset SET name=?,description=?,changed=? '+
                                                ' WHERE id='+_selected_job_asset_id,
                                                _asset_name,
                                                _asset_description,
                                                1);
                                        db.close();
                                }
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{                                                                
                                        win.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _save');
                                return; 
                        }                         
                }
                /**
                 *  check if exist any change
                 */
                function _check_if_exist_change(){
                        try{
                                var is_make_changed = false;
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_'+_type+'_asset WHERE id=?',_selected_job_asset_id);
                                if(_asset_name != rows.fieldByName('name')){
                                        is_make_changed = true;
                                }
                                if((!is_make_changed)&&(_asset_description != rows.fieldByName('description'))){
                                        is_make_changed = true;
                                }
                                rows.close();
                                db.close();
                                return is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }   
                }
        }

        win.addEventListener('open',function(){
                try{
                        if(job_base_asset_content_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_asset_content_page.prototype = new F();
                                job_base_asset_content_page.prototype.constructor = job_base_asset_content_page;
                                job_base_asset_content_page_obj = new job_base_asset_content_page();
                                job_base_asset_content_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_base_asset_content_page_obj.close_window();
                        job_base_asset_content_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());