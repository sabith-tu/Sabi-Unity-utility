using System;
using _Project.AI_StateMachine.Interface;
using SABI.AnimationStatemachine;
using Sirenix.OdinInspector;
using UnityEngine;
using UnityEngine.AI;

[AddComponentMenu(("_SABI/StateMachine/AiNavMeshManager"))]
public class AiNavMeshManager : MonoBehaviour, ITargetSettable
{
    [SerializeField] [Space(10)] [TabGroup("References")]
    private NavMeshAgent agent;

    [SerializeField] [Space(10)] [TabGroup("Settings")]
    private float delayInGameLoop = 0.5f;

    [SerializeField] [Space(10)] [TabGroup("Settings")]
    private float walkSpeed = 2f;

    [SerializeField] [Space(10)] [TabGroup("Settings")]
    private float runSpeed = 6;

    [SerializeField] [Space(10)] [TabGroup("References")]
    private SabiAnimationontroller animationController;

    [SerializeField] [Space(10)] [TabGroup("Settings")]
    private float maxSpeedOnIdle = 0.25f;

    [SerializeField] [Space(10)] [TabGroup("Settings")]
    private AnimationStateSO idle;

    [SerializeField] [Space(10)] [TabGroup("Settings")]
    private float maxSpeedOnWalking = 2.5f;

    [SerializeField] [Space(10)] [TabGroup("Settings")]
    private AnimationStateSO walking;

    [SerializeField] [Space(10)] [TabGroup("Settings")]
    private AnimationStateSO running;


    private Vector3 _targetLocation;
    private bool _shouldUpdate = false;
    private float _timeLeftForNextUpdate = 0;
    private AllAiMovementModes _currentAiMovementState = AllAiMovementModes.Non;
    private bool _shouldControlAnimation = true;


    public void SetShouldControlAnimation(bool input) => _shouldControlAnimation = input;
    public void SetTargetTransform(Transform value) => _targetLocation = value.position;
    public void SetTargetPosition(Vector3 position) => _targetLocation = position;
    public void SetAiMovementStateToRun() => SetAiMovementState(AllAiMovementModes.Run);
    public void SetAiMovementStateToWalk() => SetAiMovementState(AllAiMovementModes.Walk);

    private void Awake()
    {
        if (animationController == null) _shouldControlAnimation = false;
    }

    public void SetAiMovementState(AllAiMovementModes aiMovementState)
    {
        if (_currentAiMovementState == aiMovementState) return;

        _currentAiMovementState = aiMovementState;
        switch (_currentAiMovementState)
        {
            case AllAiMovementModes.Walk:
                agent.speed = walkSpeed;
                break;
            case AllAiMovementModes.Run:
                agent.speed = runSpeed;
                break;
        }
    }

    public void CancelMovementTargetAndSetDestinationToSelf() => agent.SetDestination(transform.position);

    void ControlAiAnimationBasedOnVelocity()
    {
        agent.SetDestination(_targetLocation);

        float currentAgentSpeed = agent.velocity.magnitude;

        if (currentAgentSpeed < maxSpeedOnIdle) animationController.SetAndRunState(idle);
        else if (currentAgentSpeed < maxSpeedOnWalking) animationController.SetAndRunState(walking);
        else animationController.SetAndRunState(running);
    }

    void MoveAi() => agent.SetDestination(_targetLocation);

    private void Update()
    {
        if (!_shouldUpdate) return;

        if (_timeLeftForNextUpdate < 0)
        {
            MoveAi();
            if (_shouldControlAnimation) ControlAiAnimationBasedOnVelocity();

            _timeLeftForNextUpdate = delayInGameLoop;
        }
        else
        {
            _timeLeftForNextUpdate -= Time.deltaTime;
        }
    }

    public void StartMovement() => _shouldUpdate = true;

    public void StopMovement()
    {
        if (_shouldUpdate == false) return;

        _shouldUpdate = false;
    }

    private void OnDrawGizmos()
    {
        if (Application.isPlaying)
        {
            Gizmos.color = Color.red;
            Gizmos.DrawLine(transform.position, _targetLocation);
            Gizmos.DrawSphere(_targetLocation, 0.2f);
        }
    }
}

public enum AllAiMovementModes
{
    Non,
    Walk,
    Run
}