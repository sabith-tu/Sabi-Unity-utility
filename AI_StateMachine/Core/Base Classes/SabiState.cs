using System.Collections.Generic;
using SABI.SOA.SimpleStatemachine;
using Sirenix.OdinInspector;
using UnityEngine;

[System.Serializable]
public class SabiState
{
    [PropertySpace(SpaceAfter = 10)] public SimpleStateSO stateName;


    [GUIColor(0.8f, 1, 0.8f)] [TabGroup("TabGroupName", "Actions")] [ChildGameObjectsOnly]
    public List<SabiActionBase> actionList;

    [TabGroup("TabGroupName/Transitions", "AfterTime")]
    public TransitionAfterTime AfterTime;

    [Space(5)] [TabGroup("TabGroupName/Transitions", "EventBased")]
    public List<DecisionAndTransition> transitionEventsList;

    [Space(5)] [TabGroup("TabGroupName/Transitions", "UpdateBased")]
    public List<DecisionAndTransition> transitionUpdateList;


    [TabGroup("TabGroupName", "Events")] [Space(10)]
    public StateEvents StateEvents;
}