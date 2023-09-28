using SABI.SOA.SimpleStatemachine;
using Sirenix.OdinInspector;
using UnityEngine;

[System.Serializable]

public class TransitionAfterTime
{
    public bool IsActive = false;

    [HorizontalGroup("TransitionAfterTimeGroup1")] [ShowIf("IsActive")]
    public float TimerLimit = 1;

    [HorizontalGroup("TransitionAfterTimeGroup1")] [DisplayAsString] [ShowIf("IsActive")]
    public float CurrentTime = 0;

    [Space(5)] [ShowIf("IsActive")] public SimpleStateSO AfterTimeTransition = null;
}