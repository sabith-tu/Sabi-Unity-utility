using System.Collections.Generic;
using SABI.SOA.SimpleStatemachine;
using Sirenix.OdinInspector;
using UnityEngine;
using UnityEngine.Events;

[AddComponentMenu(("_SABI/StateMachine/Brain"))]
public class SabiStateMachine : MonoBehaviour
{
    [TabGroup("TabGroupName", "GENARAL")] [DisplayAsString] [SerializeField]
    private SimpleStateSO currentStateName;

    [TabGroup("TabGroupName", "GENARAL")] [SerializeField]
    private float delayInGameLoop = 0.1f;

    [TabGroup("TabGroupName", "GENARAL")] [SerializeField]
    private bool shouldDebugLog = false;


    private float _timeLeftForNextUpdate = 0;

    [TabGroup("TabGroupName", "STATS")] public List<SabiState> States;

    [TabGroup("TabGroupName", "GLOBAL TRANSITION")]
    public List<DecisionAndTransition> globalTransitionList;

    private SabiState currentState;

    [TabGroup("TabGroupName", "GENARAL"), Button]
    [ContextMenu("SabiValidation")]
    public void SabiValidation()
    {
        //Transitions

        foreach (var currentGlobalDecisionAndTransition in globalTransitionList)
        {
            if (currentGlobalDecisionAndTransition.OnTrueTransition == null &&
                currentGlobalDecisionAndTransition.OnFalseTransition == null)
            {
                Debug.LogError(
                    $"{currentGlobalDecisionAndTransition.transitionName} transition have empty string in true and false state ");
            }

            if (currentGlobalDecisionAndTransition.decision == null)
            {
                Debug.LogError($"{currentGlobalDecisionAndTransition.transitionName} transition have no decision ");
            }
        }

        foreach (var state in States)
        {
            foreach (var stateTransition in state.transitionEventsList)
            {
                if (stateTransition.OnTrueTransition == null &&
                    stateTransition.OnFalseTransition == null)
                {
                    Debug.LogError(
                        $"{stateTransition.transitionName} transition have empty string in true and false state ");
                }

                if (stateTransition.decision == null)
                {
                    Debug.LogError($"{stateTransition.transitionName} transition have no decision ");
                }
            }
        }

        // actions

        foreach (var state in States)
        {
            foreach (var action in state.actionList)
            {
                if (action == null)
                {
                    Debug.LogError($"{state.stateName} state have a missing action");
                }
            }
        }
    }

    private void Start()
    {
        currentState = States[0];
        subscribeTollGlobalTransition();
        EnterCurrentState();
        currentStateName = currentState.stateName;
    }

    private void Update()
    {
        if (_timeLeftForNextUpdate < 0)
        {
            RunCurrentStateActions();
            RunCurrentStatesUpdateBasedTransition();
            _timeLeftForNextUpdate = delayInGameLoop;
        }
        else
        {
            _timeLeftForNextUpdate -= Time.deltaTime;
        }
    }

    void subscribeTollGlobalTransition()
    {
        foreach (var transitionEvents in globalTransitionList)
        {
            transitionEvents.decision.OnValueChange += CheckAllTransition;
            if (shouldDebugLog) Debug.Log($"  {transitionEvents.transitionName} is subscribed");
        }
    }

    private void EnterCurrentState()
    {
        foreach (var transitionEvents in currentState.transitionEventsList)
        {
            transitionEvents.decision.OnValueChange += CheckAllTransition;
            if (shouldDebugLog) Debug.Log($"  {transitionEvents.transitionName} is subscribed");
        }

        foreach (var iAction in currentState.actionList) iAction.ActionStart();

        if (currentState.StateEvents.useStartEvent) currentState.StateEvents.OnStateStart.Invoke();

        TimerTransitionStart();

        foreach (var transition in currentState.transitionEventsList)
        {
            if (transition.decision.ChackOnStateStart)
            {
                CheckStateEventTransitions();
            }
        }
    }

    void TimerTransitionStart()
    {
        if (currentState.AfterTime.IsActive)
        {
            currentState.AfterTime.CurrentTime = currentState.AfterTime.TimerLimit;
        }
    }

    private void RunCurrentStateActions()
    {
        foreach (var iAction in currentState.actionList) iAction.ActionUpdate();

        TimerTransitionUpdate();
    }

    private void RunCurrentStatesUpdateBasedTransition()
    {
        foreach (var updateTransition in currentState.transitionUpdateList)
        {
            if (updateTransition.IsActive)
            {
                if (updateTransition.OnTrueTransition != null)
                {
                    if (updateTransition.decision.GetResult() == true)
                        DoSetCurrentState(updateTransition.OnTrueTransition);
                }

                if (updateTransition.OnFalseTransition != null)
                {
                    if (updateTransition.decision.GetResult() == false)
                        DoSetCurrentState(updateTransition.OnFalseTransition);
                }
            }
        }
    }

    void TimerTransitionUpdate()
    {
        if (currentState.AfterTime.IsActive)
        {
            currentState.AfterTime.CurrentTime -= Time.deltaTime;
            if (currentState.AfterTime.CurrentTime <= 0) DoSetCurrentState(currentState.AfterTime.AfterTimeTransition);
        }
    }

    private void ExitCurrentState()
    {
        if (currentState.StateEvents.useExitEvent) currentState.StateEvents.OnStateExit.Invoke();

        foreach (var iAction in currentState.actionList) iAction.ActionExit();

        foreach (var transitionEvents in currentState.transitionEventsList)
        {
            transitionEvents.decision.OnValueChange -= CheckAllTransition;
            if (shouldDebugLog) Debug.Log($"  {transitionEvents.transitionName} is unsubscribed");
        }
    }


    private void CheckAllTransition()
    {
        CheckGlobalTransitions();
        CheckStateEventTransitions();
    }

    void CheckGlobalTransitions()
    {
        foreach (var currentGlobalDecisionAndTransition in globalTransitionList)
        {
            if (currentGlobalDecisionAndTransition.IsActive)
            {
                if (currentGlobalDecisionAndTransition.OnTrueTransition != null)
                {
                    if (currentGlobalDecisionAndTransition.decision.GetResult() == true)
                        DoSetCurrentState(currentGlobalDecisionAndTransition.OnTrueTransition);
                }

                if (currentGlobalDecisionAndTransition.OnFalseTransition != null)
                {
                    if (currentGlobalDecisionAndTransition.decision.GetResult() == false)
                        DoSetCurrentState(currentGlobalDecisionAndTransition.OnFalseTransition);
                }
            }
        }
    }

    void CheckStateEventTransitions()
    {
        foreach (var currentDecisionAndTransition in currentState.transitionEventsList)
        {
            if (currentDecisionAndTransition.IsActive)
            {
                if (currentDecisionAndTransition.OnTrueTransition != null)
                {
                    if (currentDecisionAndTransition.decision.GetResult() == true)
                        DoSetCurrentState(currentDecisionAndTransition.OnTrueTransition);
                }

                if (currentDecisionAndTransition.OnFalseTransition != null)
                {
                    if (currentDecisionAndTransition.decision.GetResult() == false)
                        DoSetCurrentState(currentDecisionAndTransition.OnFalseTransition);
                }
            }
        }
    }


    private void DoSetCurrentState(SimpleStateSO stringIndex)
    {
        if (shouldDebugLog) Debug.Log("New state request : " + FindSabiStateWithName(stringIndex).stateName);

        if (currentState.stateName == stringIndex) return;

        SabiState newState = FindSabiStateWithName(stringIndex);
        if (newState != null)
        {
            ExitCurrentState();
            currentState = newState;
            EnterCurrentState();
            currentStateName = currentState.stateName;
        }
    }

    private SabiState FindSabiStateWithName(SimpleStateSO nameToFind)
    {
        foreach (var sabiState in States)
        {
            if (sabiState.stateName == nameToFind)
            {
                return sabiState;
            }
        }

        Debug.LogError("State Name " + nameToFind + " is not valid - sabi");
        return null;
    }

    [ContextMenu("AddChildFolders")]
    private void AddChildFolders()
    {
        GameObject actionGameObject = new GameObject();
        actionGameObject.name = "Actions";
        actionGameObject.transform.parent = this.transform;
        actionGameObject.transform.localPosition = Vector3.zero;

        GameObject decisionGameObject = new GameObject();
        decisionGameObject.name = "Decision";
        decisionGameObject.transform.parent = this.transform;
        decisionGameObject.transform.localPosition = Vector3.zero;

        GameObject sensorGameObject = new GameObject();
        sensorGameObject.name = "Sensor";
        sensorGameObject.transform.parent = this.transform;
        sensorGameObject.transform.localPosition = Vector3.zero;

        GameObject navmeshGameObject = new GameObject();
        navmeshGameObject.name = "NavMeshManager";
        navmeshGameObject.transform.parent = this.transform;
        navmeshGameObject.AddComponent<AiNavMeshManager>();
        navmeshGameObject.transform.localPosition = Vector3.zero;
    }

    //
    // [System.Serializable]
    // public class SabiState
    // {
    //     [PropertySpace(SpaceAfter = 10)] public SimpleStateSO stateName;
    //
    //
    //     [GUIColor(0.8f, 1, 0.8f)] [TabGroup("TabGroupName", "Actions")] [ChildGameObjectsOnly]
    //     public List<SabiActionBase> actionList;
    //
    //     [TabGroup("TabGroupName/Transitions", "AfterTime")]
    //     public TransitionAfterTime AfterTime;
    //
    //     [Space(5)] [TabGroup("TabGroupName/Transitions", "EventBased")]
    //     public List<DecisionAndTransition> transitionEventsList;
    //
    //     [Space(5)] [TabGroup("TabGroupName/Transitions", "UpdateBased")]
    //     public List<DecisionAndTransition> transitionUpdateList;
    //
    //
    //     [TabGroup("TabGroupName", "Events")] [Space(10)]
    //     public StateEvents StateEvents;
    // }

    // [System.Serializable]
    // public class StateEvents
    // {
    //     public bool useStartEvent = false;
    //     public bool useExitEvent = false;
    //     [ShowIf("useStartEvent")] public UnityEvent OnStateStart;
    //     [ShowIf("useExitEvent")] public UnityEvent OnStateExit;
    // }


    // [System.Serializable]
    // public class DecisionAndTransition
    // {
    //     public string transitionName = "";
    //     public bool IsActive = true;
    //     [Space(5)] [ChildGameObjectsOnly] public SabiDecisionBase decision;
    //     [Space(5)] public SimpleStateSO OnTrueTransition = null;
    //     public SimpleStateSO OnFalseTransition = null;
    // }

    // [System.Serializable]
    // public class TransitionAfterTime
    // {
    //     public bool IsActive = false;
    //
    //     [HorizontalGroup("TransitionAfterTimeGroup1")] [ShowIf("IsActive")]
    //     public float TimerLimit = 1;
    //
    //     [HorizontalGroup("TransitionAfterTimeGroup1")] [DisplayAsString] [ShowIf("IsActive")]
    //     public float CurrentTime = 0;
    //
    //     [Space(5)] [ShowIf("IsActive")] public SimpleStateSO AfterTimeTransition = null;
    // }
}