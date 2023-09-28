using SABI.SOA.SimpleStatemachine;
using Sirenix.OdinInspector;
using UnityEngine;

[System.Serializable]
public class DecisionAndTransition
{
    public string transitionName = "";
    public bool IsActive = true;
    [Space(5)] [ChildGameObjectsOnly] public SabiDecisionBase decision;
    [Space(5)] public SimpleStateSO OnTrueTransition = null;
    public SimpleStateSO OnFalseTransition = null;
}