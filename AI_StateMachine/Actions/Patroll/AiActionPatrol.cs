using System;
using System.Collections;
using System.Collections.Generic;
using DG.Tweening;
using Sirenix.OdinInspector;
using Unity.VisualScripting;
using UnityEditor;
using UnityEngine;
using UnityEngine.AI;

[AddComponentMenu(("_SABI/StateMachine/Action/Patrol"))]
public class AiActionPatrol : SabiActionBase
{
    [TabGroup("Waypoints")] [SerializeField]
    private List<SabiWaypoint> waypoints;

    private int currentWayPoint = 0;
    private int maxWayPoints;

    [TabGroup("References")] [SerializeField]
    private Transform parentTransform;

    [TabGroup("References")] [SerializeField]
    private AiNavMeshManager navMesh;

    [TabGroup("Settings")] [SerializeField]
    private float minimumDistanceToWayPoint = 1;


    [TabGroup("Settings")] [SerializeField]
    private bool rotateTowardTheWaypointsForward = false;

    private List<Vector3> patrollPossitionList;

    private bool isWaitBtwPatrollPointOver = false;

    [TabGroup("Settings")] [SerializeField]
    private float durationWaitBtwPatrollPointOver = 4;

    [TabGroup("Debug")] [SerializeField] [DisplayAsString]
    private float distanceToTheWaypoint = -1;

    private WaitForSeconds _waitForSecondsForDelayInLoop;
    private WaitForSeconds _waitForSecondsSmallDelay;


    [TabGroup("Waypoints")]
    [Button]
    void AddNewWaypoint()
    {
        GameObject waypoint = new GameObject();
        waypoint.name = ("Waypoint" + (waypoints.Count + 1).ToString());
        waypoint.transform.parent = this.transform;
        waypoint.transform.localPosition = Vector3.zero;
        SabiWaypoint sabiWaypoint = waypoint.AddComponent<SabiWaypoint>();
        waypoints.Add(sabiWaypoint);
        if (waypoints.Count > 1)
        {
            sabiWaypoint.previewsWaypoint =
                transform.GetChild(waypoints.Count - 2).GetComponent<SabiWaypoint>();
            sabiWaypoint.previewsWaypoint.nextWaypoint = sabiWaypoint;

            waypoint.transform.position = waypoint.GetComponent<SabiWaypoint>().previewsWaypoint.transform.position;
        }

#if UNITY_EDITOR
        Selection.activeGameObject = waypoint;
#endif
    }

    [TabGroup("Waypoints")]
    [Button]
    void CloseLoop()
    {
        if (waypoints.Count > 1)
        {
            waypoints[0].GetComponent<SabiWaypoint>().previewsWaypoint =
                waypoints[waypoints.Count - 1].GetComponent<SabiWaypoint>();

            waypoints[waypoints.Count - 1].GetComponent<SabiWaypoint>()
                .nextWaypoint = waypoints[0].GetComponent<SabiWaypoint>();
        }
    }

    [ContextMenu("RemoveAllWaypoint")]
    void RemoveAllWaypoint() => waypoints.Clear();


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

    public override void ActionStart()
    {
        navMesh.SetTargetPosition(patrollPossitionList[currentWayPoint]);
        navMesh.StartMovement();
        IsActionActive = true;
        StartCoroutine(PatrolRoutine());
    }


    private IEnumerator PatrolRoutine()
    {
        while (IsActionActive)
        {
            distanceToTheWaypoint = Vector3.Distance(patrollPossitionList[currentWayPoint], transform.position);
            if (distanceToTheWaypoint < minimumDistanceToWayPoint)
            {
                if (rotateTowardTheWaypointsForward)
                {
                    parentTransform.DORotate(
                        new Vector3(0, waypoints[currentWayPoint].transform.localEulerAngles.y, 0),
                        0.4f);
                }

                yield return _waitForSecondsForDelayInLoop;
                currentWayPoint++;

                if (currentWayPoint > maxWayPoints) currentWayPoint = 0;
            }
            else
            {
                navMesh.SetTargetPosition(patrollPossitionList[currentWayPoint]);
            }

            yield return _waitForSecondsSmallDelay;
        }

        yield return null;
    }


    public override void ActionUpdate()
    {
    }

    public override void ActionExit()
    {
        navMesh.StopMovement();
        IsActionActive = false;
    }
}