using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AiState_Idle : MonoBehaviour, IBaseAiState
{
    public void StateEnter()
    {
    }

    public void StateExit()
    {
    }

    public void StateUpdate()
    {
        Debug.Log("Idle");
    }
}
