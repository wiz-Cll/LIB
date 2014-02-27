define(function(require, exports) {
    'use strict';
    var locale = require('../../locale/main').locale,
        BaseController = require('./baseController'),
        util = require('../../common/util/GlobalUtil'),
        wizConf = require('../../config/wizConf'),
        wizCenter = require('../database/wizCenter'),
        urlOperator = require('../viewer/bizManage/urlOperator'),
        remote = require('../database/remote');

    var Controller = BaseController.extend({
        wizStyle : function() {
            return this.libs.wizConf.web.style.bizManage;
        },
        wizInit: function() {
            this._super.apply(this, arguments);

            var _this = this;
            remote.setTokenInvalidCallback(function(){
                _this.tokenInvalid();
            });

            //必须先获取到用户信息
            this.initUser();
        },
        /**
         * 初始化用户信息
         */
        initUser: function() {
            var _this = this;
            //初始化用户数据模型
            this.models.user = require('../model/UserInfo');
            if (!wizCenter.token) {
                this.reLogin();
                return;
            }

            this.models.user.getBase({token:wizCenter.token}, 'wizInitUser', function(user) {
                if (!user) {
                    setTimeout(function(){
                        _this.reLogin();
                    }, 10);
                    return;
                }

                //开始调用保持在线
                _this.models.user.keepAlive();

                document.title = locale.title.bizManage;
                _this.initBiz(user);
            });
        },
        /**
         * 初始化 biz 信息
         */
        initBiz: function(user) {

            //初始化 Web 全局公共对象 wizCenter
            wizCenter.init({
                user: user
            });

            var _this = this;
            //初始化 BizInfo 数据模型
            this.models.bizInfo = require('../model/BizInfo');
            this.models.bizInfo.getBase({}, '', function(bizInfo) {
                if (bizInfo && bizInfo.code == 200) {
                    wizCenter.bizInfo = bizInfo;
                    if (bizInfo.biz_status == 0) {
                        _this.goGuide();
                        return;
                    }
                    _this.initBaseInfo();
                } else {
                    _this.goGuide();
                }
            });


        },
        initBaseInfo: function() {
            var _this = this, count = 2;
            var callback = function() {
                count--;
                if (count>0) {
                    return;
                }
                _this.initGroupMemberList();
            };

            this.models.bizInfo.getGroupList(function(groupList){
                if (groupList) {
                    wizCenter.groupList = groupList;
                }
                callback();
            });

            this.models.bizInfo.getBizMemberList({biz_guid:wizCenter.bizInfo.biz_guid}, function(memberList){
                if (memberList) {
                    wizCenter.bizMemberList = memberList;
                    wizCenter.bizManager = _this.models.bizInfo.getBizManager();
                }
                callback();
            });

        },
        initGroupMemberList: function() {
            var _this = this,
                groupList = wizCenter.groupList,
                count = groupList.length,
                i,g;

            var callback = function() {
                count--;
                if (count>0) {
                    return;
                }
                _this.initBackgroundData();
            };

            if (groupList.length == 0) {
                callback();
                return;
            }

            for (i=groupList.length - 1; i>=0; i--) {
                g = groupList[i];
                this.models.bizInfo.getGroupMemberList({kb_guid: g.kbGuid}, function(memberList){
                    callback();
                });
            }
        },
        /**
         * 初始化 全局数据
         * @param user
         * @param groupList
         */
        initBackgroundData: function() {
            //初始化数据模型
//          this.models.msg = require('../model/Message');

            this._super.apply(this, arguments);


        },
        /**
         * 初始化页面视图
         * @param user
         * @param groupList
         */
        initPage: function (user, groupList) {
            //初始化框架控制器
            this.views.pageFrame = require('../viewer/bizManage/pageFrame');
            this.views.pageFrame.init(this);

            //初始化 groupList
            this.views.groupList = require('../viewer/bizManage/groupList');
            this.views.groupList.init(this);

            //初始化 groupList
            this.views.groupMemberList = require('../viewer/bizManage/groupMemberList');
            this.views.groupMemberList.init(this);

            //初始化 addBizmember
            this.views.bizmember = require('../viewer/bizManage/bizMember');
            this.views.bizmember.init(this);

            //初始化 bizInfo
            this.views.bizInfo = require('../viewer/bizManage/bizInfo');
            this.views.bizInfo.init(this);

            //初始化 bizMemberAssign
            this.views.bizMemberAssign = require('../viewer/bizManage/bizMemberAssign');
            this.views.bizMemberAssign.init(this);

            //初始化 addGroupMember
            this.views.addGroupMember = require('../viewer/bizManage/addGroupMember');
            this.views.addGroupMember.init(this);

            //初始化 addBizMember
            this.views.addBizMember = require('../viewer/bizManage/addBizMember');
            this.views.addBizMember.init(this);

            //初始化 createGroup
            this.views.createGroup = require('../viewer/bizManage/createGroup');
            this.views.createGroup.init(this);

            //初始化 userInfo
            this.views.userInfo = require('../viewer/bizManage/userInfo');
            this.views.userInfo.init(this);

            //初始化 bizPayment
            this.views.bizPayment = require('../viewer/bizManage/bizPayment');
            this.views.bizPayment.init(this);

            this._super.apply(this, arguments);


//          console.log(this.models.bizInfo.getMemberRoleInGroups('test3@test.com'));
//          console.log(this.models.bizInfo.getMemberRoleInGroups('guide111@wiz.cn'));
//          $(document).trigger(wizConf.web.frameEventType.ShowBizMemberList);
//          setTimeout(function() {
//              $(document).trigger(wizConf.web.frameEventType.ShowMemberCharacter);
//              setTimeout(function() {
//                  $(document).trigger(wizConf.web.frameEventType.ShowBizMemberAssign);
//              }, 5000);
//
//          }, 5000);


            //触发 Url 控制器
            urlOperator.trigger();
            urlOperator.setController(this);

        },
        goGuide: function() {
            window.location = wizConf.url.bizGuide;
        },
        /**
         * token 失效后的操作
         */
        tokenInvalid: function() {
            this.showErrorMessage({
                msg: locale.errorMap.tokenInvalid,
                lock: true
            });
            setTimeout(this.reLogin, 3000);
        }
    });

    var controller = new Controller();

    return {
        init: function() {
            controller.wizInit();
        }
    };

});
