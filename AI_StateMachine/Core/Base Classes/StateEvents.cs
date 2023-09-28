using Sirenix.OdinInspector;
using UnityEngine.Events;

[System.Serializable]
public class StateEvents
{
    public bool useStartEvent = false;
    public bool useExitEvent = false;
    [ShowIf("useStartEvent")] public UnityEvent OnStateStart;
    [ShowIf("useExitEvent")] public UnityEvent OnStateExit;
}