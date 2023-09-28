using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class AiState_Chase : MonoBehaviour, IBaseAiState
{
    [SerializeField] private Transform target;
    [SerializeField] private NavMeshAgent agent;

    [SerializeField] private float speedWhenChasing;

    TimerUpdate timer = new TimerUpdate(0.1f);
    public void StateEnter()
    {
        timer.OnTimerTick += Execute;
        agent.speed = speedWhenChasing;
    }

    public void StateUpdate()
    {
        timer.UpdateTimer(Time.deltaTime);
    }

    public void StateExit()
    {
        agent.SetDestination(transform.position);
        timer.OnTimerTick -= Execute;
    }
    void Execute()
    {
        agent.SetDestination(target.position);
    }


}
