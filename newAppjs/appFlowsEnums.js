var appFlowsEnums = {
    EFlowNodeType : {
        StartNode: 10,   //起草节点
        EndNode: 20,      //结束节点
        GeneralNode: 30,   //普通节点
        ConvergeNode: 40,      //汇合节点
        ConcurrentNode: 50,   //并发节点    
        BranchNode: 60,              //分支节点
        GeneralMultiNode: 70,  //分发节点
        SubNode: 100         //子流程
    },
    EFlowLineType : {
        MainLine: 10,   // 普通线路
        ExcludeLine: 20       //排他线路 
    },
    EBookMarkType : {
        Normal: 10,   // 普通标签
        Node: 20,       //节点标签
        Line: 30           //连线标签
    },
    EEventType : {
        UsingCode: 'UsingCode',   //  引用域
        CustomCode: 'CustomCode',   //  自定义代码
        Other: 'Other',   //  其他事件
        WorkFlowEvent: 'WorkFlowEvent',       //流程事件
        WorkInstanceEvent: 'WorkInstanceEvent',       //流程事件
        NodeEvent: 'NodeEvent',           //节点普通事件
        LineEvent: 'LineEvent',            //连线普通事件
        SubNodeEvent: 'SubNodeEvent',        // 子流程事件
    },
    EFlowRecordStatus : {
        Finish: 50,   //完成状态
        Flowing: 20,      //流转状态
        Create: 10,   //初始起草状态(此时尚未选择工作流, 没有WorkFlowID/Version)
        Initial: 15,   // 初始起草状态(创建),已经绑定了工作流，但未执行过发送
        Waiting: 30,      //挂起等候状态
        Stop: 40,    //终止状态
        Hidden: 60,         //隐藏状态，并发时用到
        Scrap:70,           //废弃状态
        None: 100         //默认空状态
    },
    EFlowInboxStatus : {
        None: 10,   // 空状态，默认
        Hidden: 30,      //隐藏状态
        Normal: 20,   //正常状态
        WaitingUnlock: 50,   // 等候解锁
        WaitingSign: 40,      //等候签收
        WorkEnd: 60,     //本线支路结束 ,
        WorkStop:70,      //终止
        Delegated: 80      //委派
    },
    //节点发送模式
    ESendUserMode : {
        Normal: 10,   //正常
        ByDraft: 20,      //起草者定义
        BySendUser: 30    //发送者定义
    },
    ESourceMode : {
        DeptAndUser: 'DeptAndUser',   // 部门用户
        PositionAndUser: 'PositionAndUser',  //岗位用户
        Dept: 'Dept',      //部门
        Position: 'Position'    //岗位
    },
    //人员定义模式
    EUserMode : { 
        None :'None',   //空
        Position: 'Position', //1.指定岗位，动态获取人员
        Dept: 'Dept',    //2.指定部门，动态获取人员 
        PositionAndUser : 'PositionAndUser',   //3.指定岗位中人员  
        DeptAndUser: 'DeptAndUser',   //4.指定部门中人员    
        SpecialPositionUser: 'SpecialPositionUser',   //5. 特殊用户岗位提取模式定义
        SpecialDeptUser: 'SpecialDeptUser',     //6. 特殊用户部门提取模式定义
        CurrentOperateOne: 'CurrentOperateOne',  //7.1 当前操作者的??
        CurrentOperateTwo: 'CurrentOperateTwo',    //7.2 当前操作者的??
        CurrentOperateThree: 'CurrentOperateThree',  //7.1 当前操作者的??
        CurrentOperateFour: 'CurrentOperateFour',    //7.2 当前操作者的??
        AssignNodeOne: 'AssignNodeOne',    //8.1 指定节点的??
        AssignNodeTwo: 'AssignNodeTwo',   //8.2 指定节点的??
        AssignNodeThree: 'AssignNodeThree',    //8.3 指定节点的??
        AssignNodeFour: 'AssignNodeFour',   //8.4 指定节点的??
        AssignNodeFive: 'AssignNodeFive',    //8.5 指定节点的?? 
    },
    //人员身份
    EUserType : { 
        None: 1,    //空，默认
       
        DraftMan : 2, //起草人
         
        HandleMan : 4,   //当前经手人
         
        HaveHandledMan : 8,   //历史经手人
         
        FinishMan : 16,    //办结人
         
        Guest: 32,   //游客 
    },
    //子流程节点模式
    ESubNodeMode : {
        ThreadMode: 'ThreadMode',   //线程模式
        ProcessMode: 'ProcessMode'   //进程模式
    },
    //询问模式定义
    EEachCommand : {
        None: 1,  // 空，默认,不做任何询问
        /// <summary>
        ///  询问序号
        /// </summary> 
        AskSequ: 10,   //询问序号
    
        AskReturn: 20,  //询问是否强制退回
    
        /// <summary>
        /// 认可
        /// </summary> 
        Accept: 30,    //认可
    
        /// <summary>
        /// 
        /// </summary> 
        Asking: 40,    //询问模式
    },
    //指令集
    EFlowOperate  : {
        None: "None",     /// 无操作 
        Insert: "Insert",    ///  保存操作 
        Update: "Update",     ///  修改操作 
        Delete: "Delete",     ///  删除操作 
        Send: "Send",     ///  发送操作 
        Return: "Return",      ///  回退操作 
        EndFlow: "EndFlow",    ///  签批操作       
        GetBack: "GetBack",  ///  回收操作
        UnEndFlow: "UnEndFlow",      ///  撤销办结
        Delegate: "Delegate",    /// 直接委派操作 
        SelectFlow: "SelectFlow",   //提取流程列表
        Stop: "Stop",      /// 终止流程 
        Active: "Active",      /// 激活流程 
        ShowMonitor: "ShowMonitor",  ///  流程监控, 
        ShowHistoryMonitor: "ShowHistoryMonitor",  ///  流程监控, 
        HangUp: "HangUp",  //挂起
        UnHangUp: "UnHangUp",  //撤销挂起
        DelayDate: "DelayDate",  //延期    
        ReadFlow: "ReadFlow",  //读取流程信息
        SupplyFlow: "SupplyFlow",  //读取和处理流程节点信息，比如起草者定义时
        SupplyDesign: "SupplyDesign",   //处理配置级信息
        SupplyInstance: "SupplyInstance",   //处理流转级
        WorkList: "WorkList",     //处理文件箱，不针对某个具体的 workinfoid 实例
        Events: "Events",   //自定义代码系列
        SubFlow: "SubFlow",   //子流程专用域
        Customs: "Customs",   //外部扩展，自定义代码
        Scrap: "Scrap",    //废弃操作
        BatchSends: "BatchSends",    //批量发送
        Reports: 'Reports',     //报表系列
        Forward:'Forward',    //转发操作
    },
    //按钮许可枚举，用与、或算法可以多选
    ECanFlowOperate  : {
        None: 1,     /// 无操作 
        Insert: 2,    ///  保存操作 
        Update: 4,     ///  修改操作 
        Delete: 8,     ///  删除操作 
        Send: 16,     ///  发送操作 
        Return: 32,      ///  回退操作 
        EndFlow: 64,    ///  签批操作       
        GetBack: 128,  ///  回收操作
        UnEndFlow: 256,      ///  撤销办结
        Delegate: 512,    /// 直接委派操作 
        Delegateing:1024,   //委派中的人的操作
        Stop: 2048,      /// 终止流程 
        Active: 4096,      /// 激活流程 
        ShowMonitor: 8192,  ///  流程监控, 
        ShowHistoryMonitor: 16384,  ///  历史流程监控, 
        HangUp: 32768,  //挂起
        UnHangUp: 65536,  //撤销挂起
        DelayDate: 131072,   //延期,
        Scrap: 67108864,     //废弃
        BatchSends: 134217728,     //批量发送
        Forward: 536870912      //转发
     }
};
