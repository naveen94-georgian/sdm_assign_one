'use strict'
function BestSellingBooks(){

    BestSellingBooks.prototype.init = () => {
        $('.modal').modal();
        bindEvents();
    };

    function bindEvents(){
        $('.btn-edit').on('click',(e) => {
            var data = JSON.parse($(e.currentTarget).parent().find('.inp_data').val());
            var dialogOptions = {
                dismissible: false
            };
            let dialog = new ItemEditDialog(dialogOptions, data);
            dialog.open();
        });
        $('.btn-delete').on('click', (e) => {
            var data = JSON.parse($(e.currentTarget).parent().find('.inp_data').val());
            var dialogOptions = {
                dismissible: false
            };
            let dialog = new ItemDeleteDialog(dialogOptions, data);
            dialog.open();
        });
        $('#btn_add').on('click', (e) => {
            var dialogOptions = {
                dismissible: false
            };
            let dialog = new ItemAddDialog(dialogOptions);
            dialog.open();
        });
    };

    function ItemAddDialog(options){
        var self =this;
        var data = {};

        ItemAddDialog.prototype.onOpenEnd = () =>{
            $('#op_title').text('Add:');
            $('#btn_save').text('Add');
            bindDialogEvents();
        }

        function bindDialogEvents(){
            $('input').on('change paste keyup',(e) => {
                $(e.currentTarget).addClass('modified');
            });
            $('#btn_save').on('click',(e) => {
                if(!$('#modal1').find('input').hasClass('modified')){
                    M.Toast.dismissAll();
                    M.toast({html: 'No Changes has been made'});
                }else{
                    data.title = $('#em_title').val();
                    data.author = $('#em_author').val();
                    data.format = $('#em_format').val();
                    data.price = $('#em_price').val();
                    updateData(data);
                }
            });

            $('#btn-cancel').on('click', () => {
                self.dialog.close();
            });
        };

        function createData(data){
            
        }

        var edit_options = {
            ...options,
            onOpenEnd: self.onOpenEnd
        };

        var dialog = new ItemDialog(edit_options);
        return dialog;
    }

    function ItemEditDialog(options, data){
        var self = this;
        

        ItemEditDialog.prototype.onOpenEnd = () => {
            $('#op_title').text('Edit:');
            $('#btn_save').text('Edit');
            $('#em_title').val(data.title);
            $('#em_author').val(data.author);
            $('#em_format').val(data.format);
            $('#em_price').val(data.price);
            bindDialogEvents();
            M.updateTextFields()
        };

        function bindDialogEvents(){
            $('input').on('change paste keyup',(e) => {
                $(e.currentTarget).addClass('modified');
            });
            $('#btn_save').on('click',(e) => {
                if(!$('#modal1').find('input').hasClass('modified')){
                    M.Toast.dismissAll();
                    M.toast({html: 'No Changes has been made'});
                }else{
                    data.title = $('#em_title').val();
                    data.author = $('#em_author').val();
                    data.format = $('#em_format').val();
                    data.price = $('#em_price').val();
                    updateData(data);
                }
            });

            $('#btn-cancel').on('click', () => {
                self.dialog.close();
            });
        };

        function updateData(upd_data){
            var deferred = $.Deferred();
            var data = {
                id: upd_data._id,
                data: upd_data
            }
            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                type: 'POST',
                url: '/update_data'
            })
            .then(() => {
                return deferred.resolve();
            }).fail(() => {
                return deferred.reject();
            });
            return deferred.promise();
        };

        var edit_options = {
            ...options,
            onOpenEnd: self.onOpenEnd
        };

        var dialog = new ItemDialog(edit_options);
    
        
        return dialog;
    };

    function ItemDeleteDialog(options, data){
        var self = this;
        ItemDeleteDialog.prototype.onOpenEnd = () => {
            $('#op_title').text('Delete:');
            $('#btn_save').text('Delete');
            $('#em_title').val(data.title);
            $('#em_author').val(data.author);
            $('#em_format').val(data.format);
            $('#em_price').val(data.price);
            $('#modal1').find('input').prop('readonly', 'true');
            bindDialogEvents();
            M.updateTextFields()
        };

        function bindDialogEvents(){
            $('#btn_save').on('click',(e) => {
                deleteData(data)
            });
            $('#btn-cancel').on('click', () => {
                self.dialog.close();
            });
        }

        function deleteData(data){

        };

        var edit_options = {
            ...options,
            onOpenEnd: self.onOpenEnd
        };

        var dialog = new ItemDialog(edit_options);
        return dialog;
    }

    function ItemDialog(options){
        var self = this;
        var $modal = $('#modal1');
        ItemDialog.prototype.open = () =>{
            $modal.modal('open');
        };
        ItemDialog.prototype.close = () =>{
            $modal.modal('close');
        };

        ItemDialog.prototype.onCloseStart = () => {
            $modal.find('input').each((id, elem)=>{
                $(elem).val('');
            });
            M.updateTextFields()
        };

        $modal.modal(options);
        var opt = {
            ...options,
            onCloseStart: self.onCloseStart
        }
        console.log(opt);
        console.log(options);
        $modal.modal(opt);
    };
    
};


$(() =>{
    var books = new BestSellingBooks();
    books.init();
});