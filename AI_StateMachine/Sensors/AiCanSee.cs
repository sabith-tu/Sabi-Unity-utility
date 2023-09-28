using UnityEngine;

public class AiCanSee : MonoBehaviour
{
    public AllThingsAiCanSee whatIsThis;
}

public enum AllThingsAiCanSee
{
    Non,
    Player,
    DeadBody,
    Distraction
}