using System;
using System.Collections;
using System.Collections.Generic;
using Sirenix.OdinInspector;
using Unity.VisualScripting;
using UnityEditor;
using UnityEngine;
using UnityEngine.AI;

public class AiState_Patrol : MonoBehaviour, IBaseAiState
{
    [TabGroup("Waypoints")]
    [SerializeField]
    private List<Transform> waypoints;

    private int currentWayPoint = 0;
    private int maxWayPoints;

    [TabGroup("References")]
    [SerializeField]
    private Transform parentTransform;

    [TabGroup("References")]
    [SerializeField]
    private NavMeshAgent navMesh;

    [TabGroup("Settings")]
    [SerializeField]
    private float minimumDistanceToWayPoint = 1;


    [TabGroup("Settings")]
    [SerializeField]
    private bool rotateTowardTheWaypointsForward = false;

    private List<Vector3> patrollPossitionList;

    private bool isWaitBtwPatrollPointOver = false;

    [TabGroup("Settings")]
    [SerializeField]
    private float durationWaitBtwPatrollPointOver = 4;

    [TabGroup("Debug")]
    [SerializeField]
    [DisplayAsString]
    private float distanceToTheWaypoint = -1;

    private WaitForSeconds _waitForSecondsForDelayInLoop;
    private WaitForSeconds _waitForSecondsSmallDelay;

    TimerUpdate timer = new TimerUpdate(0.1f);


    private void Awake()
    {
        patrollPossitionList = new List<Vector3>();
        foreach (var VARIABLE in waypoints)
        {
            patrollPossitionList.Add(VARIABLE.transform.position);
            VARIABLE.gameObject.SetActive(false);
        }

        maxWayPoints = waypoints.Count - 1;

        _waitForSecondsForDelayInLoop = new WaitForSeconds(durationWaitBtwPatrollPointOver);
        _waitForSecondsSmallDelay = new WaitForSeconds(0.1f);
    }
    public void StateEnter()
    {
        timer.OnTimerTick += Execute;
        navMesh.SetDestination(patrollPossitionList[currentWayPoint]);
    }

    public void StateUpdate()
    {
        timer.UpdateTimer(Time.deltaTime);
    }

    public void StateExit()
    {
        timer.OnTimerTick -= Execute;
        navMesh.SetDestination(transform.position);
    }

    void Execute()
    {
        distanceToTheWaypoint = Vector3.Distance(patrollPossitionList[currentWayPoint], transform.position);
        if (distanceToTheWaypoint < minimumDistanceToWayPoint)
        {
            currentWayPoint++;
            if (currentWayPoint > maxWayPoints) currentWayPoint = 0;
        }
        else
        {
            navMesh.SetDestination(patrollPossitionList[currentWayPoint]);
        }
    }
}
