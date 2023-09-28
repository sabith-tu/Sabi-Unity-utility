using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Sirenix.OdinInspector;

public class AiState_Attack : MonoBehaviour, IBaseAiState
{

    TimerUpdate timer = new TimerUpdate(0.1f);
    public void StateEnter()
    {
        timer.OnTimerTick += Execute;
    }

    public void StateUpdate()
    {
        timer.UpdateTimer(Time.deltaTime);
    }

    public void StateExit()
    {
        timer.OnTimerTick -= Execute;
    }
    void Execute()
    {

    }
}
