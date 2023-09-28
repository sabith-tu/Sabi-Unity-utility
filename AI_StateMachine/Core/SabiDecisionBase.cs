using System;
using UnityEngine;

public abstract class SabiDecisionBase : MonoBehaviour
{
    public bool ChackOnStateStart = false;

    public Action OnValueChange;
    public bool Value { get; private set; }

    public void SetValue(bool newValue)
    {
        Value = newValue;
        OnValueChange?.Invoke();
    }

    public abstract bool GetResult();
}