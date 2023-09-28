using UnityEngine;
using UnityEngine.Events;


public abstract class SabiActionBase : MonoBehaviour
{
    protected bool IsActionActive = false;
    public abstract void ActionStart();
    public abstract void ActionUpdate();
    public abstract void ActionExit();
}