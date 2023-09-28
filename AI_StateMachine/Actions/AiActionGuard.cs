using DG.Tweening;
using UnityEngine;

[AddComponentMenu(("_SABI/StateMachine/Action/GuardPosition"))]
public class AiActionGuard : SabiActionBase
{
    private Vector3 _guardingLocation;
    private Vector3 _guardingRotation;
    [SerializeField] private AiNavMeshManager navmesh;
    [SerializeField] private Transform ownerBody;
    [SerializeField] private float minimumDistanceToGuardingPosition = 0.3f;
    private bool isOnGurdingPossition = false;

    private void Start()
    {
        _guardingLocation = ownerBody.position;
        _guardingRotation = ownerBody.eulerAngles;
    }
    
    void OnReachGuardingLocation() => ownerBody.DORotate(_guardingRotation, 0.3f);


    public override void ActionStart() => Tick();

    public override void ActionUpdate()
    {
        if (isOnGurdingPossition) return;

        Tick();
    }

    void Tick()
    {
        if (Vector3.Distance(ownerBody.position, _guardingLocation) > minimumDistanceToGuardingPosition)
        {
            navmesh.SetTargetPosition(_guardingLocation);
            navmesh.StartMovement();
            navmesh.SetAiMovementState(AllAiMovementModes.Walk);
        }
        else
        {
            isOnGurdingPossition = true;
            navmesh.StopMovement();
            navmesh.CancelMovementTargetAndSetDestinationToSelf();
            OnReachGuardingLocation();
        }
    }

    public override void ActionExit() => isOnGurdingPossition = false;
}